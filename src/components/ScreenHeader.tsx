import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';

type Props = {
    title: string;
    subTitle?: string;
    showBack?: boolean;
    right?:React.ReactNode; // optional element on the right side
}
const ScreenHeader = ({ title, subTitle, showBack, right }: Props) => {
    // useSafeAreaInsets gives you the exact notch/island height
   // so you can pad the header correctly on every iPhone model.
   const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, {paddingTop:insets.top+12}]}>
        <View style={styles.row}>
            {showBack && (
                <TouchableOpacity style={styles.backBtn} onPress={()=>router.back()}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
            )}
            <View style={styles.titleGroup}>
                <Text style={styles.title}>{title}</Text>
                {subTitle && <Text style={styles.subTitle}>{subTitle}</Text>}
            </View>
            {right && <View>{right}</View>}
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    header:{
        backgroundColor:Colors.primary,
        paddingHorizontal:20,
        paddingBottom:20
    },
    row:{
        flexDirection:'row',
        alignItems:'center',
        gap:12
    },
    backBtn:{
        width:34,
        height:34,
        backgroundColor:'rgba(255,255,255,0.15)',
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center'
    },
    backIcon:{
        color:Colors.white,
        fontSize:18,
        fontWeight:'600'
    },
    titleGroup:{flex:1},
    title:{
       fontSize:18,
       fontWeight:'800',
       color:Colors.white 
    },
    subTitle:{
        fontSize:11,
        color:Colors.primaryMuted,
        marginTop:2
    }
})

export default ScreenHeader