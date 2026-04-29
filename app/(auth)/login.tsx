import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'

const Login = () => {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.sub}>We'll build this fully in Phase 4</Text>
        <TouchableOpacity
        style={styles.btn}
        onPress={()=>router.replace('/(tabs)')}
        >
          <Text style={styles.btnTxt}>Continue (skip for now)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:Colors.surface,padding:20},
  container:{flex:1, justifyContent:'center', alignItems:'center', gap:16},
  title:{fontSize:24, fontWeight:'700', color:Colors.textPrimary},
  sub:{fontSize:14, color:Colors.textMuted},
  btn:{
    backgroundColor:Colors.primary,
    paddingHorizontal:32,
    paddingVertical:14,
    borderRadius:12
  },
  btnTxt:{color:Colors.white, fontSize:15, fontWeight:'600'}
})

export default Login