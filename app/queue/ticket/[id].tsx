// app/queue/ticket/[id].tsx
import {
  View, Text, StyleSheet, ScrollView, AppState, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Colors } from '@/constants/colors';
import { getTicketStatusAPI, cancelTicketAPI } from '@/api/ticket.api';
import ScreenHeader from '@/components/ScreenHeader';
import Button from '@/components/Button';
import { QueueUpdateEvent, socketService, TicketCalledEvent } from '@/services/socket';

type TicketState = {
  ticket: {
    id: string;
    token: string;
    status: string;
    queueId: string;
  };
  position: number;
  nowServing: string;
  estimatedWaitMinutes: number;
};

export default function TicketScreen() {
  const { id: ticketId, queueId } = useLocalSearchParams<{
    id: string;
    queueId: string;
  }>();

  const [data, setData] = useState<TicketState | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [isCancelling, setCancelling] = useState(false);

  // useRef keeps the latest data accessible inside socket callbacks
  // without causing re-renders or stale closure issues
  const dataRef = useRef(data);
  dataRef.current = data;

  async function fetchTicketStatus() {
    try {
      const result = await getTicketStatusAPI(queueId, ticketId);
      setData(result);
    } catch (e) {
      console.error('Failed to fetch ticket status', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTicketStatus();

    // Join the queue room for live updates
    socketService.joinQueueRoom(queueId);

    // When any ticket changes in this queue — refetch our position
    socketService.onQueueUpdated((event: QueueUpdateEvent) => {
      if (event.queueId === queueId) {
        fetchTicketStatus();
      }
    });

    // When specifically OUR ticket is called
    socketService.onTicketCalled((event: TicketCalledEvent) => {
      if (event.ticketId === ticketId) {
        Alert.alert(
          "🎉 It's your turn!",
          event.message,
          [{ text: 'OK', style: 'default' }]
        );
        fetchTicketStatus();
      }
    });

    // Leave room and remove listeners when screen unmounts
    return () => {
      socketService.leaveQueueRoom(queueId);
      socketService.offQueueUpdated();
      socketService.offTicketCalled();
    };
  }, [ticketId, queueId]);

  // Handle app coming back to foreground — refresh data
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') fetchTicketStatus();
    });
    return () => sub.remove();
  }, []);

  async function handleCancel() {
    Alert.alert(
      'Cancel your spot?',
      'You will lose your position in the queue.',
      [
        { text: 'Keep my spot', style: 'cancel' },
        {
          text: 'Yes, cancel',
          style: 'destructive',
          onPress: async () => {
            setCancelling(true);
            try {
              await cancelTicketAPI(ticketId);
              router.back();
            } catch (e: any) {
              Alert.alert('Error', e.response?.data?.error || 'Failed to cancel');
              setCancelling(false);
            }
          },
        },
      ]
    );
  }

  if (isLoading || !data) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader title="My Ticket" showBack />
        <View style={styles.center}>
          <Text style={styles.loadingText}>Loading ticket...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { ticket, position, nowServing, estimatedWaitMinutes } = data;
  const isCalled = ticket.status === 'called';

  // Build position steps
  const nowNum = parseInt(nowServing.replace(/\D/g, '') || '0');
  const myNum  = parseInt(ticket.token.replace(/\D/g, '') || '0');
  const steps  = Array.from({ length: 4 }, (_, i) => nowNum + i)
    .filter(n => n <= myNum);

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
      <ScreenHeader
        title="My Ticket"
        subTitle={`Queue position updates live`}
        showBack
      />

      {/* "Your turn" banner */}
      {isCalled && (
        <View style={styles.calledBanner}>
          <Text style={styles.calledText}>🎉 It's your turn! Please proceed.</Text>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Token card ──────────────────────────────────────── */}
        <View style={[styles.tokenCard, isCalled && styles.tokenCardCalled]}>
          <Text style={styles.tokenLabel}>YOUR NUMBER</Text>
          <Text style={[styles.tokenNumber, isCalled && styles.tokenNumberCalled]}>
            {ticket.token}
          </Text>
          <Text style={styles.tokenSub}>Ticket · #{ticket.id.slice(0, 8).toUpperCase()}</Text>

          <View style={styles.dashedLine} />

          <View style={styles.tokenMetaRow}>
            <MetaItem label="Now serving" value={nowServing} green />
            <View style={styles.metaDivider} />
            <MetaItem label="Ahead of you" value={String(position)} amber />
            <View style={styles.metaDivider} />
            <MetaItem label="Est. wait" value={`${estimatedWaitMinutes}m`} />
          </View>
        </View>

        {/* ── Live indicator ──────────────────────────────────── */}
        <View style={styles.liveRow}>
          <View style={styles.livePulse} />
          <Text style={styles.liveText}>Updating live via WebSocket</Text>
        </View>

        {/* ── Position tracker ────────────────────────────────── */}
        {steps.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Queue progress</Text>
            <View style={styles.tracker}>
              {steps.map((n, i) => {
                const isYou  = n === myNum;
                const isDone = n < nowNum;
                const isNow  = n === nowNum;

                return (
                  <View key={n} style={styles.trackerStep}>
                    <View style={[
                      styles.trackerCircle,
                      isDone && styles.circleDone,
                      isNow  && styles.circleNow,
                      isYou  && !isNow && styles.circleYou,
                    ]}>
                      <Text style={[
                        styles.circleText,
                        (isDone || isNow || isYou) && styles.circleTextLight,
                      ]}>
                        {n}
                      </Text>
                    </View>
                    <Text style={[
                      styles.trackerLabel,
                      isYou && styles.trackerLabelYou,
                    ]}>
                      {isYou ? 'You' : isDone ? 'Done' : isNow ? 'Now' : ''}
                    </Text>
                    {i < steps.length - 1 && (
                      <View style={[
                        styles.connector,
                        isDone && styles.connectorDone,
                      ]} />
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* ── Wait card ───────────────────────────────────────── */}
        <View style={[styles.card, styles.waitCard]}>
          <View style={styles.waitIcon}>
            <Text style={styles.waitIconText}>⏱</Text>
          </View>
          <View>
            <Text style={styles.waitLabel}>Estimated wait</Text>
            <Text style={styles.waitValue}>
              {estimatedWaitMinutes > 0 ? `${estimatedWaitMinutes} minutes` : 'Almost your turn!'}
            </Text>
          </View>
        </View>

        {ticket.status === 'waiting' && (
          <Button
            label="Cancel my spot"
            onPress={handleCancel}
            varient='ghost'
            loading={isCancelling}
            fullWidth
          />
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Sub-components ────────────────────────────────────────────────

function MetaItem({
  label, value, green, amber,
}: {
  label: string; value: string; green?: boolean; amber?: boolean;
}) {
  const color = green ? Colors.success : amber ? Colors.warning : Colors.textPrimary;
  return (
    <View style={styles.metaItem}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={[styles.metaValue, { color }]}>{value}</Text>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.surface },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: Colors.textMuted, fontSize: 14 },
  content: { padding: 16, gap: 14 },

  calledBanner: {
    backgroundColor: Colors.success,
    padding: 14,
    alignItems: 'center',
  },
  calledText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },

  tokenCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  tokenCardCalled: {
    borderColor: Colors.success,
    borderWidth: 2,
  },
  tokenLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.1,
    color: Colors.textHint,
    marginBottom: 6,
  },
  tokenNumber: {
    fontSize: 64,
    fontWeight: '800',
    color: Colors.primary,
    lineHeight: 72,
  },
  tokenNumberCalled: {
    color: Colors.success,
  },
  tokenSub: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 16,
  },
  dashedLine: {
    width: '100%',
    height: 1.5,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  tokenMetaRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  metaItem: { alignItems: 'center', flex: 1 },
  metaLabel: { fontSize: 10, color: Colors.textMuted, marginBottom: 3 },
  metaValue: { fontSize: 16, fontWeight: '800' },
  metaDivider: { width: 1, height: 32, backgroundColor: Colors.border },

  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  livePulse: {
    width: 8, height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  liveText: {
    fontSize: 12,
    color: Colors.textMuted,
  },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  tracker: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  trackerStep: {
    alignItems: 'center',
    gap: 6,
    position: 'relative',
    flex: 1,
  },
  trackerCircle: {
    width: 36, height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleDone: { backgroundColor: Colors.primary,      borderColor: Colors.primary },
  circleNow:  { backgroundColor: Colors.success,      borderColor: Colors.success },
  circleYou:  { backgroundColor: Colors.primaryLight, borderColor: Colors.primaryLight },
  circleText: { fontSize: 11, fontWeight: '700', color: Colors.textMuted },
  circleTextLight: { color: Colors.white },
  trackerLabel: { fontSize: 9, color: Colors.textMuted, fontWeight: '500' },
  trackerLabelYou: { color: Colors.primary, fontWeight: '700' },
  connector: {
    position: 'absolute',
    top: 17, left: '55%', right: '-55%',
    height: 2,
    backgroundColor: Colors.border,
    zIndex: -1,
  },
  connectorDone: { backgroundColor: Colors.primary },

  waitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.primarySurface,
    borderColor: Colors.primarySurface,
  },
  waitIcon: {
    width: 44, height: 44,
    backgroundColor: Colors.white,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waitIconText: { fontSize: 22 },
  waitLabel: { fontSize: 11, color: Colors.primary, fontWeight: '500' },
  waitValue: { fontSize: 18, fontWeight: '800', color: Colors.primary },
});