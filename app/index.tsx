// app/index.tsx
import Loading from '@/components/Loading';
import { useAuthStorage } from '@/store/authStore';
import { Redirect } from 'expo-router';
import { useEffect } from 'react';

export default function Index() {
  // This is where you'll later check AsyncStorage for an auth token.
  // If token exists → go to tabs. If not → show welcome.
  // For now we always redirect to welcome.

  const {user, loadFromStorage, isLoading} = useAuthStorage();

  useEffect(()=>{
    loadFromStorage();  // check AsyncStorage for saved session on app launch
  },[]);

  if(isLoading){
    return (
      <Loading/>
    )
  }
  return user
    ? <Redirect href="/(tabs)" />
    : <Redirect href="/(auth)/welcome" />;
}