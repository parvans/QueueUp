import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';


// ─── Web vs React Native quick reference ───────────────────────
// div          → View
// p / span     → Text  (ALL text MUST be inside <Text>, never loose)
// button       → TouchableOpacity  (or Pressable)
// img          → Image
// CSS classes  → StyleSheet.create({})
// CSS grid     → not available — Flexbox only
// onClick      → onPress
// ───────────────────────────────────────────────────────────────

export default function App() {
  type IUser = {
    name: string;
  };
  const [name, setName] = useState<IUser | "">("");
  return (
    // SafeAreaView = respects the iPhone notch and home indicator
    <SafeAreaView style={styles.safe}>
      {/* <StatusBar style="auto" /> */}

      

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.userName}>{name ? name.name : "Guest"}</Text>
        </View>
        {/* Avatar circle — built with View + Text, no image needed */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>RK</Text>
        </View>
      </View>

      <View style={{ backgroundColor:'#fff', borderRadius:12, padding: 5, borderWidth:2, borderColor: '#6346e4', marginTop: 16, marginHorizontal: 16 }}>
        <TextInput
          placeholder="Enter your name..."
          value={name ? name.name : ""}
          onChangeText={(text) => setName({ name: text })}
          
        />
      </View>

      {/* Scrollable content — like overflow-y: auto in CSS */}
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Search bar */}
        <View style={styles.searchBar}>
          <Text style={styles.searchText}>Search queues or enter code…</Text>
        </View>

        {/* Section heading */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nearby Queues</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* Queue cards — we'll make this a component in Phase 3 */}
        <QueueCard
          name="City Hospital – OPD"
          wait="~24 min"
          ahead={12}
          status="busy"
        />
        <QueueCard
          name="SBI Branch – Counter 2"
          wait="~6 min"
          ahead={3}
          status="open"
        />
        <QueueCard
          name="RTO Office"
          wait="Closed"
          ahead={0}
          status="closed"
        />
        <QueueCard
          name="RTO Office"
          wait="Closed"
          ahead={0}
          status="closed"
        />
        <QueueCard
          name="RTO Office"
          wait="Closed"
          ahead={0}
          status="closed"
        />
        <QueueCard
          name="RTO Office"
          wait="Closed"
          ahead={0}
          status="closed"
        />
        <QueueCard
          name="RTO Office"
          wait="Closed"
          ahead={0}
          status="closed"
        />
        <QueueCard
          name="RTO Office"
          wait="Closed"
          ahead={0}
          status="closed"
        />
        
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Reusable card component (inline for now) ──────────────────
// In Phase 3 we'll move this to src/components/QueueCard.tsx

type QueueCardProps = {
  name: string;
  wait: string;
  ahead: number;
  status: 'open' | 'busy' | 'closed';
};

function QueueCard({ name, wait, ahead, status }: QueueCardProps) {
  // Badge color changes based on status
  const badgeStyle = {
    open: styles.badgeOpen,
    busy: styles.badgeBusy,
    closed: styles.badgeClosed,
  }[status];

  const badgeLabel = {
    open: 'Open',
    busy: 'Busy',
    closed: 'Closed',
  }[status];

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.75}>
      <View style={styles.cardBody}>
        <Text style={styles.cardName}>{name}</Text>
        <Text style={styles.cardSub}>
          {ahead > 0 ? `${ahead} ahead · ${wait}` : wait}
        </Text>
      </View>
      <View style={[styles.badge, badgeStyle]}>
        <Text style={styles.badgeText}>{badgeLabel}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Styles ─────────────────────────────────────────────────────
// StyleSheet.create() is like CSS-in-JS but compiled to native code.
// Units are density-independent pixels (dp), NOT px.
// Flexbox direction defaults to COLUMN (opposite of web's row default).

const PURPLE = '#7C3AED';

const styles = StyleSheet.create({
  safe: {
    flex: 1,                    // fill the whole screen
    backgroundColor: '#F8F7FF',
  },
  header: {
    backgroundColor: PURPLE,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    flexDirection: 'row',       // horizontal layout
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 12,
    color: '#C4AEFF',
    fontWeight: '500',
  },
  userName: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
    marginTop: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,           // half of width/height = circle
    backgroundColor: '#A855F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EDE9FF',
    marginBottom: 20,
  },
  searchText: {
    color: '#B0A0C8',
    fontSize: 13,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D1B69',
  },
  seeAll: {
    fontSize: 13,
    color: PURPLE,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EDE9FF',
  },
  cardBody: {
    flex: 1,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A0F3A',
  },
  cardSub: {
    fontSize: 12,
    color: '#8B7DB5',
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  badgeOpen: {
    backgroundColor: '#DCFCE7',
  },
  badgeBusy: {
    backgroundColor: '#FEF9C3',
  },
  badgeClosed: {
    backgroundColor: '#FEE2E2',
  },
});