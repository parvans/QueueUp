import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { QueueStatus } from '@/types'
import { Colors } from '@/constants/colors'

type Props = {
    status: QueueStatus
}

const config: Record<QueueStatus, {label:string,bg:string,color:string}> = {
    open:   { label: 'Open',   bg: Colors.successSurface, color: Colors.successText },
    busy:   { label: 'Busy',   bg: Colors.warningSurface, color: Colors.warningText },
    closed: { label: 'Closed', bg: Colors.dangerSurface,  color: Colors.dangerText  },
    paused: { label: 'Paused', bg: '#F3F4F6',           color: '#374151'        },
};

const Badge = ({ status }: Props) => {
    const { label, bg, color } = config[status];
  return (
    <View style={[style.badge, { backgroundColor: bg }]}>
      <Text style={[style.text, { color }]}>{label}</Text>
    </View>
  )
}

const style = StyleSheet.create({
    badge:{
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    text:{
        fontSize: 11,
        fontWeight: '700',
    }
})

export default Badge