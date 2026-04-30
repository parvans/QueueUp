// app/(tabs)/profile.tsx
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';

const MENU_ITEMS = [
  { icon: '🔔', label: 'Notifications',    sub: 'Manage alerts' },
  { icon: '🔒', label: 'Privacy',          sub: 'Data and permissions' },
  { icon: '❓', label: 'Help & Support',   sub: 'FAQs and contact' },
  { icon: '⭐', label: 'Rate the app',     sub: 'Tell us what you think' },
  { icon: '📋', label: 'Terms of Service', sub: 'Legal stuff' },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>RK</Text>
        </View>
        <Text style={styles.name}>Rahul Kumar</Text>
        <Text style={styles.email}>rahul@example.com</Text>
        <View style={styles.statRow}>
          <StatBox label="Queues joined" value="14" />
          <StatBox label="Hours saved" value="3.2" />
          <StatBox label="This month" value="4" />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.menu}>
        {MENU_ITEMS.map((item, i) => (
          <TouchableOpacity key={i} style={styles.menuItem} activeOpacity={0.7}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <View style={styles.menuBody}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuSub}>{item.sub}</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.signOut}
          onPress={() => router.replace('/(auth)/welcome')}
        >
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.surface },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 56,
    paddingBottom: 24,
    alignItems: 'center',
    gap: 6,
  },
  avatar: {
    width: 72, height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
    marginBottom: 4,
  },
  avatarText: { fontSize: 26, fontWeight: '800', color: Colors.white },
  name: { fontSize: 20, fontWeight: '800', color: Colors.white },
  email: { fontSize: 13, color: Colors.primaryMuted },
  statRow: {
    flexDirection: 'row',
    gap: 1,
    marginTop: 16,
    width: '100%',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  statValue: { fontSize: 20, fontWeight: '800', color: Colors.white },
  statLabel: { fontSize: 10, color: Colors.primaryMuted, marginTop: 2 },
  menu: { padding: 16, gap: 10 },
  menuItem: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  menuIcon: { fontSize: 22 },
  menuBody: { flex: 1 },
  menuLabel: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  menuSub: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  menuArrow: { fontSize: 20, color: Colors.textHint },
  signOut: {
    marginTop: 8,
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.dangerSurface,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.dangerSurface,
  },
  signOutText: { fontSize: 15, fontWeight: '700', color: Colors.dangerText },
});