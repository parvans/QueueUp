// app/queue/ticket/[id].tsx
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Ticket } from '@/types';
import ScreenHeader from '@/components/ScreenHeader';

// Mock — replaced in Phase 4
const MOCK_TICKET: Ticket = {
  id: 'tk1',
  token: 'A-047',
  queueId: 'q2',
  queueName: 'SBI Branch – Counter 2',
  status: 'waiting',
  position: 3,
  nowServing: 'A-044',
  estimatedWaitMinutes: 6,
  joinedAt: new Date().toISOString(),
};

export default function TicketDetailScreen() {
  // useLocalSearchParams reads the dynamic segment from the URL
  // If you navigate to /queue/ticket/hospital-456, id = "hospital-456"
  const { id } = useLocalSearchParams<{ id: string }>();
  const ticket = MOCK_TICKET;

  // Position steps for the progress tracker
  const nowNum = parseInt(ticket.nowServing.split('-')[1])  // A-044 to 44
  const myNum = parseInt(ticket.token.split('-')[1])
  const steps  = [nowNum, nowNum + 1, nowNum + 2, myNum];



  return (
    <SafeAreaView style={styles.safe} edges={['left','right','bottom']}>
      <ScreenHeader title='My Ticket' subTitle={ticket.queueName} showBack/>
      <ScrollView>

        {/* Token Card --------------------- */}
        <View style={styles.tokenCard}>
          <Text style={styles.tokenLabel}>YOUR NUMBER</Text>
          <Text style={styles.tokenNumber}>{ticket.token}</Text>
          <Text style={styles.tokenSub}>Ticket · #{ticket.id.toUpperCase()}</Text>

          {/* Dashed divider — the "tear here" line */}
          <View style={styles.dashedLine}/>

          <View style={styles.tokenMetaRow}>
            <MetaItem label='Now serving' value={ticket.nowServing} green/>
            <View style={styles.metaDivider}/>
            <MetaItem label='Ahead of you' value={String(ticket.position)} amber/>
            <View style={styles.metaDivider}/>
            <MetaItem label='Est. wait' value={`${ticket.estimatedWaitMinutes}m`}/>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const MetaItem = ({
  label, value, green, amber
}:{
  label:string;value:string;green?:boolean;amber?:boolean
}) =>{
  return(
    <View style={styles.metaItem}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.surface },
  tokenCard:{
    backgroundColor:Colors.white,
    borderRadius:20,
    padding:20,
    alignItems:'center',
    borderWidth:1,
    borderColor:Colors.border,
    shadowColor:Colors.primary,
    shadowOffset:{width:0,height:4},
    shadowOpacity:0.1,
    shadowRadius:12,
    elevation:4
  },
  tokenLabel:{
    fontSize:10,
    fontWeight:'700',
    letterSpacing:0.1,
    color:Colors.textHint,
    marginBottom:6
  },
  tokenNumber:{
    fontSize:64,
    fontWeight:'800',
    color:Colors.primary,
    lineHeight:72
  },
  tokenSub:{
    fontSize:11,
    color:Colors.textMuted,
    marginBottom:16
  },
  dashedLine:{
    width:'100%',
    height:1.5,
    borderStyle:'dashed',
    borderWidth:2,
    borderColor:Colors.border,
    marginBottom:16
  },
  tokenMetaRow:{
    flexDirection:'row',
    width:'100%',
    justifyContent:'space-between',
    alignItems:'center'
  },
  metaItem:{
    alignItems:'center',
    flex:1
  },
  metaLabel:{
    fontSize:12,
    color:Colors.textMuted,
    marginBottom:3
  },
  metaValue:{
    fontSize:16,
    fontWeight:'800',
    color:Colors.textPrimary
  },
  metaDivider:{
    width:1,
    height:32,
    backgroundColor:Colors.border
  }

});