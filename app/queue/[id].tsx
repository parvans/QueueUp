// app/queue/[id].tsx
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors } from '@/constants/colors';

export default function QueueDetailScreen() {
  // useLocalSearchParams reads the dynamic segment from the URL
  // If you navigate to /queue/hospital-456, id = "hospital-456"
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        {/* Back button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Queue Detail</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.label}>Queue ID:</Text>
        <Text style={styles.id}>{id}</Text>
        <Text style={styles.hint}>Full UI in Phase 3</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.surface },
  header: {
    backgroundColor: Colors.primary,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  back: {
    width: 32, height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: { color: Colors.white, fontSize: 18 },
  title: { fontSize: 18, fontWeight: '700', color: Colors.white },
  body: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  label: { fontSize: 12, color: Colors.textMuted },
  id: { fontSize: 20, fontWeight: '700', color: Colors.primary },
  hint: { fontSize: 13, color: Colors.textMuted, marginTop: 8 },
});