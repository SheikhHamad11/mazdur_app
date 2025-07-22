import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, Pressable } from 'react-native';
import AppText from '../../components/AppText';
import MyButton from '../../components/MyButton';

export default function WelcomeScreen({ navigation }) {
    const [language, setLanguage] = useState('English');

    const handleRoleSelect = (role) => {
        // You can store the selected role and language globally if needed
        navigation.navigate('Register', { role, language });
    };

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/mazdur.png')} style={{ width: 300, height: 300 }} />
            <AppText style={styles.title} font='bold'>Welcome to Mazdur App</AppText>
            <AppText style={styles.subtitle}>Select your role:</AppText>


            <View style={styles.buttonGroup}>
                <MyButton onPress={() => handleRoleSelect('labour')} title="Sign Up as Labour" />
                <MyButton onPress={() => handleRoleSelect('employer')} title="Sign Up as Employer" />

            </View>

            <Pressable style={styles.button2} onPress={() => navigation.navigate('Login')} >
                <AppText >Already have account? </AppText>
                <AppText font='bold' >Login Here</AppText>
            </Pressable>

            {/* <Text style={styles.languageLabel}>Select Language:</Text>
            <View style={styles.languageGroup}>
                {['English', 'اردو', 'हिन्दी'].map((lang) => (
                    <TouchableOpacity key={lang} onPress={() => Alert.alert('Change Language', 'Coming Soon')} style={[
                        styles.languageButton,
                        language === lang && styles.languageButtonSelected
                    ]}>
                        <Text style={[styles.languageText, language === lang && { color: 'white' }]}>{lang}</Text>
                    </TouchableOpacity>
                ))}
            </View> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    title: {
        fontSize: 26,
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 12,
        color: '#555',
    },
    buttonGroup: {
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#052E5F',
        padding: 14,
        borderRadius: 10,
        marginVertical: 8,
        width: 220,
        alignItems: 'center',
    },
    button2: {
        width: '100%',
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: '#052E5F',
        borderRadius: 8
    },
    buttonText: {
        color: '#FFF',

    },
    languageLabel: {
        fontSize: 16,
        marginBottom: 8,
        color: '#444',
    },
    languageGroup: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    languageButton: {
        padding: 10,
        marginHorizontal: 6,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#999',
    },
    languageButtonSelected: {
        backgroundColor: '#052E5F',
        borderColor: '#052E5F',
    },
    languageText: {
        color: '#333',
    },
});
