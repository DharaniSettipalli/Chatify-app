import { sendWelcomeEmail } from "../emails/emailHandlers.js"
import { generateToken } from "../lib/utils.js"
import { userModel } from "../Models/userModel.js"
import bcrypt from 'bcryptjs'
import 'dotenv/config'

export const signup = async (req, res) => {
    const { fullName, email, password} = req.body
    try {
        //checking if all the fields are populated
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Please enter all the required fields" })
        }

        //password length check
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be atleast 6 characters" })
        }

        //email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Please enter valid email" })
        }

        //checking if user already exists
        const exist = await userModel.findOne({ email })
        if (exist) {
            return res.status(400).json({ message: "User already exists" })
        }

        //password hashing
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        //creating user
        const newUser = new userModel({
            fullName,
            email,
            password: hashedPassword,
        })
        if (newUser) {
            
            const savedUser = await newUser.save()
            generateToken(savedUser._id, res);

            res.status(201).json({
                message: 'User is created',
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })

            //send a welcome email
            try {
                await sendWelcomeEmail(savedUser.email, savedUser.fullName, process.env.CLIENT_URL)
            } catch (error) {
                console.error('Failed to send welcome email: ', error)
            }
        }
        else {
            return res.status(400).json({ message: "Invalid user data" })
        }    
    } catch (error) {
        console.log('Error occured while signup: ', error);
        return res.status(500).json({message: "server error"})
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' })
    }

    try {
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(400).json({message:'Invalid credentials'})
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' })
        
        generateToken(user._id, res)

        res.status(200).json({
            message: 'User logged in',
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })

    } catch (error) {
        console.log(`Error logging in user: ${error}`);
        return res.status(500).json({ message: 'server error' })
    }
}

export const logout = (_, res) => {
    res.cookie('jwt', '', { maxAge: 0 })
    res.status(200).json({message:'Logged out successfully'})
}
