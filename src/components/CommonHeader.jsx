import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
export default function CommonHeader({ title, isfire }) {
    // console.log('title', title);
    return (
        <View style={styles.header}>
            <Text style={[styles.headerTitle, { textTransform: 'uppercase' }]}>
                {title}
            </Text>
            {/* Left Blue Expanded Shape */}
            <View style={styles.blueExpansion} />
            {isfire === true && <Icon name="person" size={25} color="white" style={{ marginTop: -10 }} />}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#052E5F',
        flexDirection: 'row',
        justifyContent: 'center',
        borderBottomRightRadius: 50,
        padding: 24,
        // elevation: 1,
        gap: 10,
        width: '100%',
        // flex: 1,
    },
    // blueExpansion: {
    //   position: 'absolute',
    //   bottom: -50,
    //   left: 0,
    //   width: 50, // Adjust width for the desired look
    //   height: 50, // Adjust height for the desired look
    //   backgroundColor: '#152B43', // Blue color for the shape
    //   borderBottomRightRadius: 120, // Rounded shape effect
    //   zIndex: 0, // Keep it behind the header content
    // },
    headerTitle: {
        fontSize: 18,
        fontWeight: 700,
        color: 'white',
        marginTop: -10,
    },
});
