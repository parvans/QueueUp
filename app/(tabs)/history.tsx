import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const History = () => {
  return (
    <SafeAreaView style={historyStyles.safe}>
      <Text>history</Text>
    </SafeAreaView>
  )
}

const historyStyles = StyleSheet.create({
  safe:{
    flex:1,
    padding:20
  }
});
export default History