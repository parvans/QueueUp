// app/queue/[id].tsx
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors } from '@/constants/colors';
import ScreenHeader from '@/components/ScreenHeader';
import { Queue } from '@/types';
import Badge from '@/components/Badge';

// Mock — replaced in Phase 4
const MOCK_QUEUE: Queue = {
  id: 'q1',
  name: 'City Hospital – OPD',
  organization: 'Kozhikode Medical Centre',
  status: 'busy',
  waitMinutes: 24,
  peopleAhead: 12,
  totalServedToday: 247,
  operatingHours: '8:00 AM – 5:00 PM',
};

export default function QueueDetailScreen() {
  // useLocalSearchParams reads the dynamic segment from the URL
  // If you navigate to /queue/hospital-456, id = "hospital-456"
  const { id } = useLocalSearchParams<{ id: string }>();

  // In Phase 4: fetch queue by id from API
  const queue = MOCK_QUEUE;

  const handleJoin = () =>{
    // In Phase 4: POST /tickets/join, then navigate to ticket screen
    router.push(`/queue/ticket/${queue.id}`);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['left','right','bottom']}>
      <ScreenHeader title={queue.name} subTitle={queue.organization} showBack/>
      <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      >
        {/* Status + wait info */}
        <View style={styles.heroRow}>
          <Badge status={queue.status}/>
          <Text style={styles.wait}>~{queue.waitMinutes} min wait</Text>
        </View>

        {/* Info card */}
        <View style={styles.card}>
          <InfoRow label='People ahead' value={String(queue.peopleAhead)} highlight/>
          <InfoRow label='Served today' value={String(queue.totalServedToday)} />
          <InfoRow label='Operating hours' value={String(queue.operatingHours)} highlight last/>
          <InfoRow label='Your turn around' value="~10:42 AM"/>
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const InfoRow = ({
  label, value, highlight, last
}:{
  label:string; value:string; highlight?:boolean; last?:boolean;
}) =>{
  return(
    <View style={[styles.infoRow, !last && styles.infoRowBorder]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, highlight && styles.infoValueHighlight]}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.surface },
  scroll:{
    flex:1
  }, 
  content: { padding: 16, gap: 12 },
  heroRow:{
    flexDirection:'row',
    alignItems:'center',
    gap:12,
    paddingVertical:4
  },
  wait:{
    fontSize:15,
    fontWeight:'600',
    color:Colors.textSecondary
  },
  card:{
    backgroundColor:Colors.white,
    borderRadius:16,
    borderWidth:1,
    borderColor:Colors.border,
    overflow:'hidden'
  },
  infoRow:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    padding:14
  },
  infoRowBorder:{
    borderBottomWidth:1,
    borderBottomColor:Colors.border
  },
  infoLabel:{
    fontSize:13,
    color:Colors.textMuted
  },
  infoValue:{
    fontSize:13,
    color:Colors.textPrimary,
    fontWeight:'600'
  },
  infoValueHighlight: { color: Colors.primary },
});