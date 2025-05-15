import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'

export default function CommonButton({ title, onPress }) {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
    button: {
        backgroundColor: '#052E5F',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '500' },
});