import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/constants/colors'
import { router } from 'expo-router'

const Home = () => {
  return (
    <SafeAreaView style={homeStyles.safe}>
      <View style={homeStyles.header}>
        <Text style={homeStyles.name}>Home</Text>
      </View>
      <View style={homeStyles.body}>
        <Text style={homeStyles.hint}>Real UI coming in Phase 3</Text>
        {/* Test dynamic navigation — tap to go to a queue detail screen */}
        <TouchableOpacity
          style={homeStyles.btn}
          onPress={() => router.push('/queue/queue-123')}
        >
          <Text style={homeStyles.btnText}>Open Queue Detail →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const homeStyles = StyleSheet.create({
  safe:{
    flex:1,
    backgroundColor:Colors.surface,
  },
  name:{color:Colors.white, fontSize:20, fontWeight:'700'},
  header:{backgroundColor:Colors.primary, padding:20, paddingTop:16},
  body:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    gap:16
  },
  hint:{fontSize:14, color:Colors.textMuted},
  btn: { backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  btnText: { color: Colors.white, fontWeight: '600' },
});
export default Home