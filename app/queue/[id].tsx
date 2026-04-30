// app/queue/[id].tsx
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors } from '@/constants/colors';
import ScreenHeader from '@/components/ScreenHeader';
import { Queue } from '@/types';
import Badge from '@/components/Badge';
import Button from '@/components/Button';

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

        {/* Notification toggle */}
        <View style={styles.card}>
          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleTitle}>Notify me when close</Text>
              <Text style={styles.toggleSub}>Alert when 2 people are ahead</Text>
            </View>
            {/* Simple toggle — use a Switch component in Phase 4 */}
            <View style={styles.toggleOn}>
              <View style={styles.toggleThumb} />
            </View>
          </View>
        </View>

        {/* How it works */}
        <Text style={styles.sectionTitle}>How it works</Text>
        <View style={styles.card}>
          <Step num="1" text="Tap Join Queue below" />
          <Step num="2" text="You'll get a token number instantly" />
          <Step num="3" text="Watch your position update in real time" />
          <Step num="4" text="Get notified when you're almost up" last />
        </View>
      </ScrollView>

      {/* Sticky bottom join button */}
      <View style={styles.footer}>
        <Button
         label={queue.status === 'closed' ? 'Queue is Closed': 'Join Queue'}
         onPress={handleJoin}
         disabled={queue.status==='closed'}
         fullWidth
        />
      </View>
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

function Step({ num, text, last }: { num: string; text: string; last?: boolean }) {
  return (
    <View style={[styles.step, !last && styles.stepBorder]}>
      <View style={styles.stepNum}>
        <Text style={styles.stepNumText}>{num}</Text>
      </View>
      <Text style={styles.stepText}>{text}</Text>
    </View>
  );
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
  toggleRow:{
    flexDirection:'row',
    justifyContent:'space-between',
    padding:14,
    alignItems:'center'

  },
  toggleTitle: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  toggleSub: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  toggleOn: {
    width: 44, height: 26,
    backgroundColor: Colors.primary,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 3,
  },
  toggleThumb: {
    width: 20, height: 20,
    backgroundColor: Colors.white,
    borderRadius: 10,
  },
  sectionTitle:{
    fontSize:15,
    fontWeight:'700',
    color:Colors.textSecondary,
    marginTop:4
  },
  step:{
    flexDirection:'row',
    alignItems:'center',
    gap:12,
    padding:14
  },
  stepBorder:{
    borderBottomWidth:1,
    borderBottomColor:Colors.border
  },
  stepNum:{
    width:28,
    height:28,
    borderRadius:14,
    backgroundColor:Colors.primarySurface,
    justifyContent:'center',
    alignItems:'center'
  },
  stepNumText:{
    fontSize:13,
    fontWeight:'700',
    color:Colors.primary
  },
  stepText:{
    fontSize:13,
    color:Colors.textPrimary,
    flex:1
  },
  footer:{
    padding:16,
    paddingBottom:28,
    backgroundColor:Colors.white,
    borderTopWidth:1,
    borderTopColor:Colors.border
  }
});