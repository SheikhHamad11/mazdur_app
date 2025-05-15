import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
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
                <Text style={styles.title}>Welcome, Employer! {userData?.name}</Text>

                <CommonButton title={'Post a Job'} onPress={() => navigation.navigate('PostJob')} />
                <CommonButton title={'My Posted Jobs'} onPress={() => navigation.navigate('JobsPosted')} />
                <CommonButton title={'Watch Mazdoor TV'} onPress={() => navigation.navigate('MazdoorTV')} />
                <CommonButton title={'Settings'} onPress={() => navigation.navigate('Settings')} />
                {/* <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EmployerSettings')}>
                    <Text style={styles.buttonText}>Post a Job</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('JobsPosted')}>
                    <Text style={styles.buttonText}>My Posted Jobs</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MazdoorTV')}>
                    <Text style={styles.buttonText}>Watch Mazdoor TV</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EmployerSettings')}>
                    <Text style={styles.buttonText}>Settings</Text>
                </TouchableOpacity> */}

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
