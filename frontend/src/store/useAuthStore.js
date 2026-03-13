import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
//import { signup } from "../../../backend/src/Controllers/authControllers";
import toast from "react-hot-toast";
//import { log } from "console";

export const useAuthStore = create((set) => (
    {
        authUser: null,
        isCheckingAuth: true,
        isSigningUp: false,
        isLoggingIn: false,

        checkAuth: async () => {
            try {
                const res = await axiosInstance.get('http://localhost:3000/api/auth/check')
                set({ authUser: res.data })
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
        }
        


    }
))