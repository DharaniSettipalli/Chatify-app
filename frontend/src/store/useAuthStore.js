import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:3000/' : '/'
export const useAuthStore = create((set, get) => (
    {
        authUser: null,
        isCheckingAuth: true,
        isSigningUp: false,
        isLoggingIn: false,
        socket: null,
        onlineUsers: [],

        checkAuth: async () => {
            try {
                const res = await axiosInstance.get('http://localhost:3000/api/auth/check')
                set({ authUser: res.data })
                get().connectSocket() //connect socket after auth check
            } catch (error) {
                console.log('Error in auth check: ', error);
                set({ authUser: null })

            } finally {
                set({ isCheckingAuth: false })
            }
        },

        signup: async (data) => {
            set({ isSigningUp: true })
            try {
                //console.log(axiosInstance);

                const res = await axiosInstance.post('http://localhost:3000/api/auth/signup', data)
                set({ authUser: res.data })
                
                toast.success('Account created successfully')
                get().connectSocket() //connect socket after signup
            } catch (error) {
                console.log('Error in signup: ', error);
                toast.error(error.response.data.message)
            } finally {
                set({ isSigningUp: false })
            }
        },

        login: async (data) => {
            set({ isLoggingIn: true })
            try {
                //console.log(axiosInstance);
                const res = await axiosInstance.post('http://localhost:3000/api/auth/login', data)
                set({ authUser: res.data })
                toast.success('Logged in successfully')
                get().connectSocket() //connect socket after login
            } catch (error) {
                console.log('Error in login: ', error);
                toast.error(error.response.data.message)
            } finally {
                set({ isLoggingIn: false })
            }
        },

        logout: async () => {
            try {
              
                await axiosInstance.post('http://localhost:3000/api/auth/logout')
                set({ authUser: null })
                get().disconnectSocket() //disconnect socket on logout
                toast.success('Logged out successfully')
            } catch (error) {
                console.log('Error logging out: ', error);
                
            toast.error('Error occurred while logging out')
          }
        },

        updateProfile: async (data) => {
            try {
                const res = await axiosInstance.put('http://localhost:3000/api/auth/updateProfile', data)
                console.log(res);
                
                set({ authUser: res.data })
                toast.success('Profile updated successfully')
            } catch (error) {
                console.log('Error updating profile: ', error);
                toast.error('Error occurred while updating profile')
            }
        },

        connectSocket: () => {
            const { authUser } = get()
            if (!authUser || get().socket?.connected) return
            
            const socket = io( BASE_URL, {
                withCredentials: true //this ensures cookes are sent with the connection
            })

            socket.connect()

            set({ socket })
            
            //listen for online users event
            
            

            socket.on('getOnlineUsers', (userIds) => {
                set({ onlineUsers: userIds })
                console.log('online users: ', get().onlineUsers);
            }
            )


        },

        disconnectSocket: () => {
         if(get().socket?.connected) get().socket.disconnect()
        }
    }
))