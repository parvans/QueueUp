// app/(tabs)/tickets.tsx
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Ticket } from '@/types';

const MOCK_TICKETS: Ticket[] = [
  {
    id: 'tk1',
    token: 'A-047',
    queueId: 'q2',
    queueName: 'SBI Branch – Counter 2',
    status: 'waiting',
    position: 3,
    nowServing: 'A-044',
    estimatedWaitMinutes: 6,
    joinedAt: new Date().toISOString(),
  },
];

export default function TicketsScreen() {
  const active   = MOCK_TICKETS.filter(t => t.status === 'waiting' || t.status === 'called');
  const past     = MOCK_TICKETS.filter(t => t.status === 'served'  || t.status === 'cancelled');

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Tickets</Text>
        <Text style={styles.sub}>{active.length} active</Text>
      </View>

      <FlatList
        data={active}
        keyExtractor={t => t.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🎫</Text>
            <Text style={styles.emptyText}>No active tickets</Text>
            <Text style={styles.emptySub}>Join a queue from the Home screen</Text>
          </View>
        }
        renderItem={({ item: ticket }) => (
          <TouchableOpacity
            style={styles.ticketRow}
            onPress={() => router.push(`/queue/ticket/${ticket.id}`)}
            activeOpacity={0.75}
          >
            <View style={styles.tokenBadge}>
              <Text style={styles.tokenText}>{ticket.token}</Text>
            </View>
            <View style={styles.ticketInfo}>
              <Text style={styles.ticketName}>{ticket.queueName}</Text>
              <Text style={styles.ticketMeta}>
                {ticket.position} ahead · ~{ticket.estimatedWaitMinutes} min
              </Text>
            </View>
            <View style={styles.liveChip}>
              <Text style={styles.liveDot}>●</Text>
              <Text style={styles.liveText}>Live</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.surface },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: { fontSize: 22, fontWeight: '800', color: Colors.white },
  sub: { fontSize: 12, color: Colors.primaryMuted, marginTop: 2 },
  list: { padding: 16, gap: 12 },
  empty: { alignItems: 'center', paddingTop: 80, gap: 8 },
  emptyIcon: { fontSize: 48 },
  emptyText: { fontSize: 16, fontWeight: '700', color: Colors.textSecondary },
  emptySub: { fontSize: 13, color: Colors.textMuted },
  ticketRow: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tokenBadge: {
    backgroundColor: Colors.primarySurface,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tokenText: { fontSize: 16, fontWeight: '800', color: Colors.primary },
  ticketInfo: { flex: 1 },
  ticketName: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  ticketMeta: { fontSize: 11, color: Colors.textMuted, marginTop: 3 },
  liveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.dangerSurface,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  liveDot: { fontSize: 8, color: Colors.danger },
  liveText: { fontSize: 10, fontWeight: '700', color: Colors.dangerText },
});