// app/queue/ticket/[id].tsx
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Ticket } from '@/types';
import ScreenHeader from '@/components/ScreenHeader';
import Button from '@/components/Button';

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
      <ScrollView
      contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

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

        {/* Position Tracker ----------------------- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Queue Progress</Text>
          <View style={styles.tracker}>
            {steps.map((n,i)=>{
              const isYou = n===myNum;
              const isDone = n<=nowNum;
              const isNext = n===nowNum+1;
              const label = `A-${n}`;
              return (
                <View key={n} style={styles.trackerStep}>
                  <View style={[
                    styles.trackerCircle,
                    isDone && styles.circleDone,
                    isNext && styles.circleNext,
                    isYou && styles.circleYou,
                    ]}>
                    <Text
                    style={[
                      styles.circleText,
                      (isDone || isYou) && styles.circleTextLight,
                    ]}
                    >
                      {n}
                    </Text>
                  </View>
                  <Text style={[styles.trackerLabel, isYou && styles.trackerLabelYou]}>
                    {isYou ? 'You' : isDone ? 'Done' : isNext ? 'Next' : label}
                  </Text>

                  {/* Connector line between steps */}
                  {
                    i < steps.length - 1 && (
                      <View style={[styles.connector, isDone && styles.connectorDone]}/>
                    )
                  }
                </View>
              )
            })}
          </View>
        </View>

        {/* ── Wait time card ─────────────────────────────────── */}
        <View style={[styles.card, styles.waitCard]}>
          <View style={styles.waitIcon}>
            <Text style={styles.waitIconText}>⏱</Text>
          </View>
          <View>
            <Text style={styles.waitLabel}>Estimated wait</Text>
            <Text style={styles.waitValue}>{ticket.estimatedWaitMinutes} minutes</Text>
          </View>
        </View>

         {/* In Phase 5 this updates live via Socket.io */}
         <Text style={styles.liveHint}>
          🔴 Live updates coming in Phase 5
         </Text>

         <Button
          label="Cancel my spot"
          onPress={() => console.log("Cancel")
          }
          varient='ghost'
          fullWidth
        />

        <View style={{ height: 24 }} />
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
  content: { padding: 16, gap: 14 },
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
  },
  card:{
    backgroundColor:Colors.white,
    padding:16,
    borderRadius:16,
    borderWidth:1,
    borderColor:Colors.border
  },
  cardTitle:{
    fontSize:14,
    fontWeight:'700',
    color:Colors.textSecondary,
    marginBottom:16
  },
  tracker:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'flex-start',
    position:'relative'
  },
  trackerStep:{
    alignItems:'center',
    gap:6,
    position:'relative',
    flex:1
  },
  trackerCircle:{
    width:36,
    height:36,
    backgroundColor:Colors.surface,
    borderWidth:2,
    borderColor:Colors.border,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:18,
    zIndex:1
  },
  circleDone:{
    backgroundColor:Colors.primary,
    borderColor:Colors.primary
  },
  circleNext:{
    backgroundColor:Colors.white,
    borderColor:Colors.primary
  },
  circleYou:{
    backgroundColor:Colors.primaryLight,
    borderColor:Colors.primaryLight
  },
  circleText:{
    fontSize:11,
    fontWeight:'700',
    color:Colors.textMuted
  },
  circleTextLight:{
    color:Colors.white
  },
  trackerLabel:{
    fontSize:10,
    color:Colors.textMuted,
    fontWeight:'500'
  },
  trackerLabelYou:{
    color:Colors.primary,
    fontWeight:'700'
  },
connector: {
    position: 'absolute',
    top: 17,
    left: '55%',
    right: '-55%',
    height: 2,
    backgroundColor: Colors.border,
    zIndex: 0,
  },
  connectorDone: { backgroundColor: Colors.primary },
  waitCard:{
    flexDirection:'row',
    alignItems:'center',
    gap:14,
    backgroundColor:Colors.primarySurface,
    borderColor:Colors.primarySurface
  },
  waitIcon:{
    width:44,
    height:44,
    borderRadius:12,
    backgroundColor:Colors.white,
    justifyContent:'center',
    alignItems:'center'
  },
  waitIconText:{
    fontSize:22
  },
  waitLabel:{
    fontSize:11,
    color:Colors.primary,
    fontWeight:'500'
  },
  waitValue:{
    fontSize:18,
    color:Colors.primary,
    fontWeight:'500'
  },
  liveHint:{
    textAlign:'center',
    fontSize:12,
    color:Colors.textMuted
  }
});