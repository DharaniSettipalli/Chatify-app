import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

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


}))