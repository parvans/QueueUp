// app/(auth)/login.tsx
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { Colors } from '@/constants/colors';
import { useAuthStorage } from '@/store/authStore';
import Button from '@/components/Button';

export default function LoginScreen() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuthStorage();

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    await login(email, password);
    const user = useAuthStorage.getState().user;
    if (user) router.replace('/(tabs)');
  }

  return (
    // KeyboardAvoidingView pushes content up when keyboard appears
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>

          <TouchableOpacity onPress={() => router.back()} style={styles.back}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.sub}>Sign in to your account</Text>

          {error && (
            <TouchableOpacity style={styles.errorBanner} onPress={clearError}>
              <Text style={styles.errorText}>{error} · tap to dismiss</Text>
            </TouchableOpacity>
          )}

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                placeholder="you@example.com"
                placeholderTextColor={Colors.textHint}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="••••••••"
                placeholderTextColor={Colors.textHint}
              />
            </View>
          </View>

          <Button
            label="Sign in"
            onPress={handleLogin}
            loading={isLoading}
            fullWidth
          />

          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.switchText}>
              Don't have an account?{' '}
              <Text style={styles.switchLink}>Register</Text>
            </Text>
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.surface },
  container: { flex: 1, padding: 24, gap: 16 },
  back: { marginBottom: 8 },
  backText: { fontSize: 15, color: Colors.primary, fontWeight: '600' },
  title: { fontSize: 28, fontWeight: '800', color: Colors.textPrimary },
  sub: { fontSize: 15, color: Colors.textMuted },
  errorBanner: {
    backgroundColor: Colors.dangerSurface,
    borderRadius: 10,
    padding: 12,
  },
  errorText: { color: Colors.dangerText, fontSize: 13 },
  form: { gap: 14, marginTop: 8 },
  field: { gap: 6 },
  label: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  input: {
    height: 50,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  switchText: { textAlign: 'center', fontSize: 14, color: Colors.textMuted },
  switchLink: { color: Colors.primary, fontWeight: '700' },
});