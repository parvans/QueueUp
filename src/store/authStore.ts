import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginAPI, registerAPI } from '@/api/auth.api';
import { socketService } from '@/constants/services/socket';

type User = {
  id: string; 
  name: string; 
  email: string; 
  role: string;
};

type AuthStore = {
    user: User | null;
    accessToken: string | null;
    isLoading: boolean;
    error: string | null;

    login:(email:string, password:string)=> Promise<void>;
    register:(name:string, email:string, password:string)=> Promise<void>;
    logout:()=> Promise<void>;
    loadFromStorage:()=> Promise<void>;
    clearError:()=> void;
};

export const useAuthStorage = create<AuthStore>((set)=>({
    user: null,
    accessToken: null,
    isLoading: false,
    error: null,

    login: async(email, password)=>{
        set({isLoading:true, error:null});

        try {
            const { user, accessToken, refreshToken } = await loginAPI(email, password);
            await AsyncStorage.multiSet([
                ['accessToken', accessToken],
                ['refreshToken', refreshToken],
                ['user', JSON.stringify(user)],
            ]);
            set({user, accessToken, isLoading:true});

            // Connect socket immediately after login
            await socketService.connect();

        } catch (e:any) {
            set({ error: e.response?.data?.error || 'Login failed', isLoading: false });
        }
    },
    register: async(name, email, password)=>{
        set({isLoading:true, error:null});
        try {
            const { user, accessToken, refreshToken } = await registerAPI({ name, email, password });
            await AsyncStorage.multiSet([
                ['accessToken',  accessToken],
                ['refreshToken', refreshToken],
                ['user',         JSON.stringify(user)],
            ]);
            set({ user, accessToken, isLoading: false });
        } catch (e:any) {
            set({ error: e.response?.data?.error || 'Registration failed', isLoading: false });
        }
    },
    logout: async () => {
        // Disconnect the socket before clearing tokens
        await socketService.disconnect();

        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
        set({ user: null, accessToken: null });

    },

  loadFromStorage: async () => {
    const [[, token], [, userStr]] = await AsyncStorage.multiGet([
      'accessToken', 'user',
    ]);
    if (token && userStr) {
      set({ accessToken: token, user: JSON.parse(userStr) });

      // Reconnect socket on app relaunch if already logged in
      await socketService.connect();
    }
  },
    clearError: () => set({ error: null }),
}))