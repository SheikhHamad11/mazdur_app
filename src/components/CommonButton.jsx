import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import AppText from './AppText';

export default function CommonButton({ title, onPress, disabled }) {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress} disabled={disabled}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({

    title: { fontSize: 24, marginBottom: 30 },
    button: {
        backgroundColor: '#052E5F',
        padding: 10,
        borderRadius: 10,
        marginBottom: 15,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '500' },
});