import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';

export default function WelcomeScreen({ navigation }) {
    const [language, setLanguage] = useState('English');

    const handleRoleSelect = (role) => {
        // You can store the selected role and language globally if needed
        navigation.navigate('Register', { role, language });
    };

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/mazdur.png')} style={{ width: 300, height: 300 }} />
            <Text style={styles.title}>Welcome to Mazdur App</Text>
            <Text style={styles.subtitle}>Select your role:</Text>


            <View style={styles.buttonGroup}>
                <TouchableOpacity style={styles.button} onPress={() => handleRoleSelect('labour')}>
                    <Text style={styles.buttonText}>Sign Up as Labour</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handleRoleSelect('employer')}>
                    <Text style={styles.buttonText}>Sign Up as Employer</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.languageLabel}>Select Language:</Text>
            <View style={styles.languageGroup}>
                {['English', 'اردو', 'हिन्दी'].map((lang) => (
                    <TouchableOpacity key={lang} onPress={() => Alert.alert('Change Language', 'Coming Soon')} style={[
                        styles.languageButton,
                        language === lang && styles.languageButtonSelected
                    ]}>
                        <Text style={[styles.languageText, language === lang && { color: 'white' }]}>{lang}</Text>
                    </TouchableOpacity>
                ))}
            </View>
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
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
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
    buttonText: {
        color: '#FFF',
        fontWeight: '600',
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
