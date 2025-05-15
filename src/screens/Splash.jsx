import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

export default function SplashScreen({ navigation }) {
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         navigation.replace('Home'); // Navigate to Welcome after 3 seconds
    //     }, 3000);

    //     return () => clearTimeout(timer);
    // }, []);

    return (
        <View style={styles.container}>
            <Image source={require('../assets/mazdur.png')} style={styles.logo} />
            <Text style={styles.tagline}>Connecting Laborers</Text>
            <Text style={styles.tagline1}>With Work Worldwide</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 260,
        height: 260,
        resizeMode: 'contain',
    },
    tagline: {
        marginTop: 20,
        fontSize: 26,
        fontWeight: '600',
        color: '#444',
        textAlign: 'center',
    },
    tagline1: {

        fontSize: 18,

        color: '#444',
        textAlign: 'center',
    },
});
