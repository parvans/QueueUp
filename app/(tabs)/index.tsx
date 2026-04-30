import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/constants/colors'
import { router } from 'expo-router'
import ScreenHeader from '@/components/ScreenHeader'
import { Queue } from '@/types'
import QueueCard from '@/components/QueueCard'

// ── Mock data (replaced with API calls in Phase 4) ──────────────
const MOCK_QUEUES: Queue[] = [
  {
    id: 'q1',
    name: 'City Hospital – OPD',
    organization: 'Kozhikode Medical Centre',
    status: 'busy',
    waitMinutes: 24,
    peopleAhead: 12,
    totalServedToday: 247,
    operatingHours: '8:00 AM – 5:00 PM',
  },
  {
    id: 'q2',
    name: 'SBI Branch – Counter 2',
    organization: 'State Bank of India',
    status: 'open',
    waitMinutes: 6,
    peopleAhead: 3,
    totalServedToday: 89,
    operatingHours: '10:00 AM – 4:00 PM',
  },
  {
    id: 'q3',
    name: 'RTO Office',
    organization: 'Kerala Motor Vehicles Dept.',
    status: 'closed',
    waitMinutes: 0,
    peopleAhead: 0,
    totalServedToday: 134,
    operatingHours: '9:00 AM – 5:00 PM',
  },
  {
    id: 'q4',
    name: 'Malabar Salon',
    organization: 'Malabar Premium Salon',
    status: 'open',
    waitMinutes: 15,
    peopleAhead: 5,
    totalServedToday: 42,
    operatingHours: '9:00 AM – 8:00 PM',
  },
  {
    id: 'q5',
    name: 'Aster Clinic – General',
    organization: 'Aster MIMS',
    status: 'busy',
    waitMinutes: 30,
    peopleAhead: 18,
    totalServedToday: 310,
    operatingHours: '8:30 AM – 6:00 PM',
  },
  {
    id: 'q6',
    name: 'KSRTC Ticket Counter',
    organization: 'Kerala RTC',
    status: 'open',
    waitMinutes: 10,
    peopleAhead: 4,
    totalServedToday: 156,
    operatingHours: '6:00 AM – 10:00 PM',
  },
  {
    id: 'q7',
    name: 'Passport Seva Kendra',
    organization: 'Govt. of India',
    status: 'busy',
    waitMinutes: 40,
    peopleAhead: 20,
    totalServedToday: 98,
    operatingHours: '9:00 AM – 4:00 PM',
  },
  {
    id: 'q8',
    name: 'Reliance Smart Billing',
    organization: 'Reliance Retail',
    status: 'open',
    waitMinutes: 8,
    peopleAhead: 2,
    totalServedToday: 210,
    operatingHours: '9:00 AM – 9:00 PM',
  },
  {
    id: 'q9',
    name: 'Dental Care Unit',
    organization: 'Baby Memorial Hospital',
    status: 'open',
    waitMinutes: 12,
    peopleAhead: 6,
    totalServedToday: 67,
    operatingHours: '10:00 AM – 7:00 PM',
  },
  {
    id: 'q10',
    name: 'Electricity Board Office',
    organization: 'KSEB',
    status: 'closed',
    waitMinutes: 0,
    peopleAhead: 0,
    totalServedToday: 145,
    operatingHours: '9:00 AM – 3:00 PM',
  },
];


const HomeScreen = () => {
  const [code, setCode] = useState('');

  // Filter logic — in Phase 4 this becomes a real search API call
  const queues = MOCK_QUEUES;


  return (
    // edges prop controls which sides get safe area padding.
    // 'top' is handled by our own header, so we exclude it.
    <SafeAreaView style={homeStyles.safe} edges={['left','right']}>

      {/* Header ----------------------------------- */}
      <View style={homeStyles.header}>
        <View style={homeStyles.topRow}>
          <View>
            <Text style={homeStyles.greeting}>Good morning,</Text>
            <Text style={homeStyles.userName}>Parvan S</Text>
          </View>
          <View style={homeStyles.avatar}>
            <Text style={homeStyles.avatarText}>RK</Text>
          </View>
        </View>
      </View>

      {/* Quick join by code */}
      <View style={homeStyles.joinRow}>
        <TextInput
        style={homeStyles.codeInput}
        placeholder="Enter queue code…"
        placeholderTextColor={Colors.primaryMuted}
        value={code}
        onChangeText={setCode}
        autoCapitalize='characters'
        />
        <TouchableOpacity
        style={[homeStyles.joinBtn, !code && homeStyles.joinBtnDisabled]}
        disabled={!code}
        activeOpacity={0.8}
        >
          <Text style={homeStyles.joinBtnText}>Join</Text>
        </TouchableOpacity>
      </View>

      {/* Body ---------------------------------------------- */}
      <ScrollView 
      style={homeStyles.scroll}
      contentContainerStyle={homeStyles.scrollContent}
      showsVerticalScrollIndicator={false}
      >
        {/* Stats strip */}
        <View style={homeStyles.statsRow}>
          <StarPill label='Active queue' value='4'/>
          <StarPill label='Open now' value='4'/>
          <StarPill label='My tickets' value='4'/>
        </View>
        <View style={homeStyles.sectionHeader}>
          <Text style={homeStyles.sectionTitle} >Queue Near You</Text>
          <TouchableOpacity>
            <Text style={homeStyles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {queues.map(q => (
          <QueueCard key={q.id} queue={q} />
        ))}
        {/* Bottom padding so last card isn't hidden behind tab bar */}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

// ── Small inline components (too small to extract to own files) ──
const StarPill = ({label, value}:{label:string; value:string}) =>{
  return (
    <View style={homeStyles.pill}>
      <Text style={homeStyles.pillValue}>{value}</Text>
      <Text style={homeStyles.pillLabel}>{label}</Text>
    </View>
  )
}

const homeStyles = StyleSheet.create({
  safe:{
    flex:1,
    backgroundColor:Colors.surface,
  },
  header:{
    backgroundColor:Colors.primary,
    paddingTop:56,     // accounts for status bar on most iPhones
    paddingHorizontal:20,
    paddingBottom:20,
    gap:16
  },
  topRow:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
  greeting:{
    fontSize:12,
    color:Colors.primaryMuted,
    fontWeight:'500'
  },
  userName:{
    color:Colors.white, 
    fontSize:20, 
    fontWeight:'800',
    marginTop:2
  },
  avatar:{
    width:42,
    height:42,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:21,
    backgroundColor:Colors.primaryLight
  },
  avatarText:{
    color:Colors.white,
    fontSize:15,
    fontWeight:'800'
  },
  joinRow:{
    flexDirection:'row',
    gap:10
  },
  codeInput:{
    flex:1,
    height:46,
    backgroundColor:'rgba(255,255,255,0.15)',
    borderRadius:12,
    paddingHorizontal:14,
    //color:Colors.white,
    fontSize:14,
    fontWeight:'600',
    letterSpacing:1
  },
  joinBtn:{
    backgroundColor:Colors.white,
    borderRadius:20,
    paddingHorizontal:20,
    justifyContent:'center'
  },
  joinBtnDisabled: {opacity: 0.4},
  joinBtnText:{
    color:Colors.primary,
    fontWeight:'800',
    fontSize:14
  },
  scroll:{
    flex:1
  },
  scrollContent:{
    paddingHorizontal:20,
    paddingTop:20
  },
  statsRow:{
    flexDirection:'row',
    gap:10,
    marginBottom:24
  },
  pill:{
    flex:1,
    backgroundColor:Colors.white,
    borderRadius:12,
    padding:12,
    alignItems:'center',
    borderWidth:1,
    borderColor:Colors.border
  },
  pillValue:{
    fontSize:20,
    fontWeight:'800',
    color:Colors.primary
  },
  pillLabel:{
    fontSize:10,
    color:Colors.textMuted,
    marginTop:2,
    textAlign:'center'
  },
  sectionHeader:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginBottom:14
  },
  sectionTitle:{
    fontSize:16,
    fontWeight:'700',
    color:Colors.textSecondary
  },
  seeAll:{
    fontSize:13,
    color:Colors.primary,
    fontWeight:'600'
  }
});
export default HomeScreen