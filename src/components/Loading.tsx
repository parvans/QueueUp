import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/colors'

const Loading = () => {
  return (
    <View style={styles.container}>
        <ActivityIndicator color={Colors.primary} size="large" />
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})

export default Loading