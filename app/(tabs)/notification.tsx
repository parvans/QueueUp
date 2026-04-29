// app/(tabs)/notification.tsx
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';

export default function NotificationScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>My Notifications</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.hint}>Active notifications will appear here</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.surface },
  header: { backgroundColor: Colors.primary, padding: 20 },
  title: { fontSize: 20, fontWeight: '700', color: Colors.white },
  body: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  hint: { fontSize: 14, color: Colors.textMuted },
});