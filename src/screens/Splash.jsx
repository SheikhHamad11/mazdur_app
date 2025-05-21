import React, { useEffect, useRef } from 'react';
import { View, Image, Text, StyleSheet, Animated, Easing } from 'react-native';

export default function SplashScreen({ navigation }) {
    const slideAnim = useRef(new Animated.Value(-200)).current; // start above the screen
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Parallel animation: slide + fade
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 1500,
                useNativeDriver: true,
                easing: Easing.bounce, // bounce effect
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
            }),
        ]).start();

        // const timer = setTimeout(() => {
        //     navigation.replace('Home'); // Navigate to your desired screen
        // }, 3000);

        // return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <Animated.Image
                source={require('../assets/mazdur.png')}
                style={[
                    styles.logo,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    },
                ]}
            />
            <Animated.Text style={[styles.tagline, { opacity: fadeAnim }]}>
                Connecting Laborers
            </Animated.Text>
            <Animated.Text style={[styles.tagline1, { opacity: fadeAnim }]}>
                With Work Worldwide
            </Animated.Text>
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
