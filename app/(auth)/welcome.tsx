import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/constants/colors'
import { router } from 'expo-router'

const Welcome = () => {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        <View style={styles.logoBox}>
          <Text style={styles.logoTxt}>Q</Text>
        </View>

        <Text style={styles.title}>Skip the line.{'\n'}Join smart.</Text>
        <Text style={styles.subTitle}>
          Manage any queue - hospitals, banks,{'\n'}
          salons, government offices
        </Text>

        {/* 
          router.replace() replaces the current screen in the stack.
          Use this instead of router.push() for auth flows so the user
          can't press Back and return to the welcome screen.
        */}

        <TouchableOpacity
        style={styles.prinaryBtn}
        onPress={()=>router.replace('/(tabs)')}
        activeOpacity={0.85}
        >
          <Text style={styles.prinaryBtnTxt}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
        style={styles.secondaryBtn}
        onPress={() => router.push('/(auth)/login')}
        activeOpacity={0.85}
        >
          <Text style={styles.secondaryBtnTxt}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:{
    flex:1,
    backgroundColor:Colors.primaryDeep,
    padding:20
  },
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    paddingHorizontal:32,

  },
  logoBox:{
    width:72,
    height:72,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:Colors.primary,
    borderRadius:20,
    marginBottom:8
  },
  logoTxt:{
    fontSize:36,
    fontWeight:'800',
    color:Colors.white
  },
  title:{
    fontSize:28,
    fontWeight:'800',
    color:Colors.white,
    textAlign:'center',
    lineHeight:36
  },
  subTitle:{
    fontSize:14,
    textAlign:'center',
    lineHeight:22,
    marginBottom:8,
    color:Colors.primaryMuted
  },
  prinaryBtn:{
    width:'100%',
    height:52,
    borderRadius:14,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:Colors.primary,
    marginBottom:10
  },
  prinaryBtnTxt:{
    color:Colors.white,
    fontSize:16,
    fontWeight:'700'
  },
  secondaryBtn:{
    width:'100%',
    height:48,
    backgroundColor:Colors.primary,
    borderRadius:14,
    borderWidth:1,
    borderColor: '#3A2E58',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryBtnTxt:{
    color: Colors.primaryMuted,
    fontSize: 15,
    fontWeight: '500',
  }
})

export default Welcome