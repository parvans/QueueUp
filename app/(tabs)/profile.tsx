import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Profile = () => {
  return (
    <SafeAreaView style={profileStyles.safe}>
      <Text>profile</Text>
    </SafeAreaView>
  )
}

const profileStyles = StyleSheet.create({
  safe:{
    flex:1,
    padding:20
  }
});
export default Profile