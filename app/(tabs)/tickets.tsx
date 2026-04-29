// app/(tabs)/tickets.tsx
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { router } from 'expo-router';

export default function TicketsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>My Tickets</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.hint}>Active tickets will appear here</Text>

        {/* Test dynamic navigation — tap to go to a queue detail screen */}
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => router.push('queue/ticket/ticket-001')}
                >
                  <Text style={styles.btnText}>Open Ticket Detail →</Text>
                </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.surface },
  header: { backgroundColor: Colors.primary, padding: 20 },
  title: { fontSize: 20, fontWeight: '700', color: Colors.white },
  body: { flex: 1, gap: 16, justifyContent: 'center', alignItems: 'center' },
  hint: { fontSize: 14, color: Colors.textMuted },

  btn: { backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  btnText: { color: Colors.white, fontWeight: '600' },
});