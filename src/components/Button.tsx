import { Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/colors';

type Varient = 'primary' | 'secondary' | 'danger' | 'ghost' ;
type Props = {
    label: string;
    varient?: Varient;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
}
const Button = ({ label, varient = 'primary', onPress, loading, disabled, fullWidth }: Props) => {
    const containerStyle = [
        styles.base,
        styles[varient],
        fullWidth && styles.full,
        (disabled || loading) && styles.disabled

    ];

  return (
    <TouchableOpacity
    style={containerStyle}
    onPress={onPress}
    disabled={disabled || loading}
    activeOpacity={0.8}
    >
        {
            loading ? (
                <ActivityIndicator color={varient === 'primary' ? '#fff' : Colors.primary} />
            ) :(
                <Text style={[styles.label, styles[`${varient}Label`]]}>
                    {label}
                </Text>
            )
        }
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    base:{
        height: 50,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    full:{width: '100%',},
    disabled:{opacity: 0.5},

    primary:{backgroundColor: Colors.primary},
    secondary:{backgroundColor: Colors.primarySurface},
    danger:{backgroundColor: Colors.dangerSurface},
    ghost:{backgroundColor: 'transparent', borderWidth: 1.5, borderColor: Colors.border},

    label:          { fontSize: 15, fontWeight: '700' },
    primaryLabel:   { color: Colors.white },
    secondaryLabel: { color: Colors.primary },
    ghostLabel:     { color: Colors.textSecondary },
    dangerLabel:    { color: Colors.dangerText },
})

export default Button