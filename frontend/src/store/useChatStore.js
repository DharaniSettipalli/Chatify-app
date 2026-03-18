import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import axios from "axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: 'chats',
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSoundEnabled: JSON.parse(localStorage.getItem('isSoundEnabled')),

    toggleSound: () => {
        localStorage.setItem('isSoundEnabled', !get().isSoundEnabled)
        set({ isSoundEnabled: !get().isSoundEnabled })
    },

    setActiveTab: (tab) => {
        set({ activeTab: tab })
    },

    setSelectedUser: (selectedUser) => {
        set({ selectedUser })
    },

    getAllContacts: async () => {
        set({ isUsersLoading: true })
        try {
            const res = await axiosInstance.get('http://localhost:3000/api/messages/contacts')
            set({ allContacts: res.data })
        } catch (error) {
            console.error('Error fetching contacts:', error)
            toast.error('Error fetching contacts')
        } finally {
            set({ isUsersLoading: false })
        }
    },
    getMyChatPartners: async () => {
        set({ isUsersLoading: true })
        try {
            const res = await axiosInstance.get('http://localhost:3000/api/messages/chats')
            set({ chats: res.data })
            console.log(res);
            
        } catch (error) {
            console.error('Error fetching chat partners:', error)
            toast.error('Error fetching chat partners')
        } finally {
            set({ isUsersLoading: false })
        }
    },
    getMessagesByUserId: async (userId) => {
        set({ isMessagesLoading: true })
        try {
            const res = await axiosInstance.get(`http://localhost:3000/api/messages/${userId}`)
            set({ messages: res.data })
        } catch (error) {
            console.error('Error fetching messages:', error)
            toast.error('Error fetching messages')
        } finally {
            set({ isMessagesLoading: false })
        }
    },
    
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get()
        const { authUser } = useAuthStore.getState()
        
        const tempId = `temp-${Date.now()}`

        const optimisticMessage = {
            _id: tempId,
            senderId: authUser._id,
            receiverId: selectedUser._id,
            text: messageData.text,
            image: messageData.image,
            createdAt: new Date().toISOString(),
            isOptimistic: true, // flag to identify optimistic messages
        }

        //immediately update the UI with the new message
        set({ messages: [...messages, optimisticMessage] })
        
        try {
            const res = await axiosInstance.post(`http://localhost:3000/api/messages/send/${selectedUser._id}`, messageData)
            set({ messages: messages.concat(res.data)})
        } catch (error) {
            set({ messages: messages})
            toast.error(error.response?.data?.message || 'Error sending message')
            console.error('Error sending message:', error)
        }
    }
}))