// app/index.tsx
import { Redirect } from 'expo-router';

export default function Index() {
  // This is where you'll later check AsyncStorage for an auth token.
  // If token exists → go to tabs. If not → show welcome.
  // For now we always redirect to welcome.
  return <Redirect href="/(auth)/welcome" />;
}