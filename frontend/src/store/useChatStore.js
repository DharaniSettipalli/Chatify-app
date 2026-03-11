import { create } from "zustand";

export const useChatStore = create((set, get) => ({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: 'chats',
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSoundEnabled: localStorage.getItem('isSoundEnabled'),

    toggleSound: () => {
        localStorage.setItem('isSoundEnabled', !get().isSoundEnabled)
        set({ isSoundEnabled: !get().isSoundEnabled })
    },

    setActiveTab: (tab) => {
        activeTab: tab
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
        } catch (error) {
            console.error('Error fetching chat partners:', error)
            toast.error('Error fetching chat partners')
        } finally {
            set({ isUsersLoading: false })
        }
    },


}))