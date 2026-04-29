import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Tickets = () => {
  return (
    <SafeAreaView style={ticketsStyles.safe}>
      <Text>Tickets</Text>
    </SafeAreaView>
  )
}

const ticketsStyles = StyleSheet.create({
  safe:{
    flex:1,
    padding:20
  }
});
export default Tickets