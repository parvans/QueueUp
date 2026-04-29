import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Home = () => {
  return (
    <SafeAreaView style={homeStyles.safe}>
      <Text>Home</Text>
    </SafeAreaView>
  )
}

const homeStyles = StyleSheet.create({
  safe:{
    flex:1,
    padding:20
  }
});
export default Home