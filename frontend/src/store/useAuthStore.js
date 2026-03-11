import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
//import { signup } from "../../../backend/src/Controllers/authControllers";
import toast from "react-hot-toast";
//import { log } from "console";

export const useAuthStore = create((set) => (
    {
        authUser: false,
        isCheckingAuth: true,
        isSigningUp: false,

        checkAuth: async () => {
            try {
                const res = await axiosInstance('http://localhost:3000/api/auth/check')
                set({ authUser: res.data})
            } catch (error) {
                console.log('Error in auth check: ', error);
                set({ authUser: null })
            
            } finally {
                set({isCheckingAuth: false})
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
                set({isSigningUp: false})
            }
        }
        
    }
))