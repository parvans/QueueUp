import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Queue } from '@/types'
import { router } from 'expo-router'
import Badge from './Badge'
import { Colors } from '@/constants/colors'

type Props = {
    queue:Queue
}
const QueueCard = ({ queue }: Props) => {
    
  return (
    <TouchableOpacity
    style={[
        style.card,
        queue.status === 'open' && style.borderOpen,
        queue.status === 'busy' && style.borderBusy,
        queue.status === 'closed' && style.borderClose,
    ]}
    activeOpacity={0.75}
    onPress={()=>router.push(`/queue/${queue.id}`)}
    >
        <View style={style.iconBox}>
            <Text style={style.iconText}>Q</Text>
        </View>
        <View style={style.body}>
            <Text style={style.name} numberOfLines={1}>{queue.name}</Text>
            <Text style={style.org} numberOfLines={1}>{queue.organization}</Text>
            {queue.status !== 'closed' && (
                <Text style={style.waitInfo}>
                    {queue.peopleAhead} ahead · {queue.waitMinutes} min
                </Text>
            )}
        </View>
        <Badge status={queue.status} />
    </TouchableOpacity>
  )
}

const style = StyleSheet.create({
    card:{
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    // Shadow — works differently on iOS vs Android
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,           // Android shadow
    },
    borderOpen:{borderLeftWidth:3,borderLeftColor:Colors.success},
    borderBusy:{borderLeftWidth:3,borderLeftColor:Colors.warning},
    borderClose:{borderLeftWidth:3,borderLeftColor:Colors.danger},

    iconBox:{
        backgroundColor:Colors.primarySurface,
        width:44,
        height:44,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:12,
    },
    iconText:{
        color: Colors.primary,
        fontSize:18,
        fontWeight:'800',
    },
    body:{flex:1},
    name:{
        fontSize:14,
        fontWeight:'700',
        color:Colors.textPrimary,
    },
    org:{
        fontSize:11,
        color:Colors.textMuted,
        marginTop:2
    },
    waitInfo:{
        fontSize:11,
        color:Colors.textMuted,
        marginTop:3
    }

});

export default QueueCard