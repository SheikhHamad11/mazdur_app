import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import AppText from './AppText';

export default function MyButton({ onPress, title, style, width = 'auto', disabled, titleColor = 'white', titleStyle }) {
    return (
        <TouchableOpacity disabled={disabled} style={[styles.button, style, { width: width }]} onPress={onPress}>
            <AppText style={[{ color: titleColor }, titleStyle]} font='medium'>{title}</AppText>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({

    button: {
        backgroundColor: '#052E5F',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        alignItems: 'center',
    },

});