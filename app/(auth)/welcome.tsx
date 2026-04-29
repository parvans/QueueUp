import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/constants/colors'

const Welcome = () => {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <Text style={{color:Colors.white,fontSize:24,fontWeight:'bold'}}>Welcome to QueueUp!</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:{
    flex:1,
    backgroundColor:Colors.primaryDeep,
    padding:5
  }
})

export default Welcome