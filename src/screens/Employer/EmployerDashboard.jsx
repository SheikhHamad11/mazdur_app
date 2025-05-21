import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth'
import { useAuth } from '../../components/AuthContext';
import CommonHeader from '../../components/CommonHeader';
import CommonButton from '../../components/CommonButton';
export default function EmployerDashboard() {
    const navigation = useNavigation();
    const { logout, userData } = useAuth();

    return (
        <>
            <CommonHeader title={'Employer Dashboard'} isfire={true} />
            <ScrollView contentContainerStyle={styles.container}>

                {userData?.photoURL ? (
                    <Image source={{ uri: userData?.photoURL }} style={styles.avatar} />
                ) : (
                    <Image source={require('../../assets/placeholder.png')} style={styles.avatar} />
                )}
                <Text style={styles.title}>Welcome, Employer! {userData?.name}</Text>
                <CommonButton title={'Post a Job'} onPress={() => navigation.navigate('PostJob')} />
                <CommonButton title={'My Posted Jobs'} onPress={() => navigation.navigate('JobsPosted')} />
                <CommonButton title={'Watch Mazdoor TV'} onPress={() => navigation.navigate('MazdurTV')} />
                <CommonButton title={'Settings'} onPress={() => navigation.navigate('Settings')} />

            </ScrollView>
        </>

    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: 'white',
        flex: 1

    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center'

    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginVertical: 10,
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
});
