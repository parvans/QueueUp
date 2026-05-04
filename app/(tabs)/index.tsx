import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/constants/colors'
import { router } from 'expo-router'
import ScreenHeader from '@/components/ScreenHeader'
import { Queue } from '@/types'
import QueueCard from '@/components/QueueCard'
import { useQueueStore } from '@/store/queueStore'
import Loading from '@/components/Loading'

const HomeScreen = () => {
  const {queues, fetchQueue, fetchQueues, isLoading} = useQueueStore();
  const [code, setCode] = useState<string | ''>('');

  useEffect(()=>{
    fetchQueues();
  },[]);

  // Filter logic — in Phase 4 this becomes a real search API call


  // Map backend response to our Queue type
  // (backend uses UPPERCASE status, our type uses lowercase)
  const mappedQueues = queues.map(q => ({
    ...q,
    status: q.status.toLowerCase() as any,
  }));

  if (isLoading && queues.length === 0) {
    return (
      <Loading/>
    );
  }

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

        {mappedQueues.map(q => (
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