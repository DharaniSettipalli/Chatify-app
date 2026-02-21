import cloudinary from "../lib/cloudinary.js";
import Message from "../Models/Message.js";
import { userModel } from "../Models/userModel.js";

export const getAllContacts = async (req, res) => {
    try {
        const loggedInUserId = req.user._id
        const filteredUsers = await userModel.find({ _id: { $ne: loggedInUserId } }).select('-password')

        res.status(200).json(filteredUsers)
    } catch (error) {
        console.log('Error fetching contacts: ', error);
        return res.status(500).json({ message: 'Internal server error' })

    }
}

export const getMessagesByUserId = async (req, res) => {
    try {
        const myId = req.user._id
        const { id: userToChatId } = req.params

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ]
        })

        res.status(200).json(messages)

    } catch (error) {
        console.log('Error fetching messages: ', error);
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body

        const { id: receiverId } = req.params
        const senderId = req.user._id

        if (!text && !image) {
            return res.status(400).json({ message: "Fill in something to send" })
        }
        if (senderId.equals(receiverId)) {
            return res.status(400).json({ message: 'Cannot send messages to yourself' })
        }

        const receiverExists = await User.exists({ _id: receiverId })
        if (!receiverExists) {
            return res.status(404).json({ message: 'Receiver not found' })
        }

        let imageUrl
        if (image) {
            //upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        await newMessage.save()

        res.status(201).json(newMessage)

        //todo: send message in real-time if user is online using socket.io


    } catch (error) {
        console.log('Error sending messages: ', error);
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export const getChatPartners = async (req, res) => {
    //find all the messages where the logged in user is either a sender or a receiver
    try {
        const loggedInUserId = req.user._id

        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId },
                { receiverId: loggedInUserId }
            ]
        })
        //console.log('me');

        const chatPartnerIds = [
            ...new Set(
                messages.map((msg) => {
                    return msg.senderId.toString() === loggedInUserId.toString()
                        ? msg.receiverId.toString() :
                        msg.senderId.toString()
                })
            )
        ]
        console.log(chatPartnerIds);

        const chatPartners = await userModel.find({
            _id: {
                $in: chatPartnerIds
            }
        }).select('-password')

        res.status(200).json(chatPartners)
    }
    catch (error) {
        console.log('Error fetching chat partners: ', error);
        return res.status(500).json({ message: 'Internal server error' })
    }
}



