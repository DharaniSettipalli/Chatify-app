import jwt from 'jsonwebtoken'
import { userModel } from '../Models/userModel.js'

export const socketAuthMiddleware = async (socket, next) => {

    try {
        //extract token from cookie
        const token = socket.handshake.headers.cookie?.split('; ').find((str) => str.startsWith('jwt='))?.split('=')[1]

        if (!token) {
            return next(new Error('Authentication error'))
        }

        //verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) {
            console.log("socket connection rejected: Invalid token");
            return next(new Error('Unauthorized - Invalid token'))
            
        }

        //find the user from db
        const user = await userModel.findById(decoded.userId).select('-password')
        if (!user) {
            console.log("socket connection rejected: User not found");
            return next(new Error('Unauthorized - User not found'))
        }

        //attach user info to socket
        socket.user = user
        socket.userId = user._id.toString()
        console.log(`socket connection authenticated for user ${user.fullName} (${user._id})`);
        next()
    } catch (error) {
        console.error("socket authentication error:", error);
        return next(new Error('Authentication error'))
    }
}