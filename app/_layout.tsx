import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {/*
        Stack = a stack navigator (screens slide in/out).
        screenOptions={{ headerShown: false }} hides the default
        header on every screen — we build our own custom headers.
      */}
      <Stack screenOptions={{headerShown:false}}>
        {/* 
          (auth) and (tabs) are route groups — the parentheses
          mean the folder name is NOT part of the URL.
          /welcome, not /(auth)/welcome
        */}

        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen 
          name='queue/[id]'
          options={{
            presentation:'card', // slides up from bottom
            headerShown:false
          }}
        />
      </Stack>

    </SafeAreaProvider>
  )
}