import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import CommonHeader from '../../components/CommonHeader';
import { useAuth } from '../../components/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';
export default function LaborerSettings() {
    const navigation = useNavigation();
    const { logout, userData } = useAuth();


    const handleEditProfile = () => {
        navigation.navigate('EditProfile'); // create this screen separately
    };

    const handleChangeLanguage = () => {
        Alert.alert('Language', 'Coming soon.');
        // navigation.navigate('LanguageSelector'); // create this screen if needed
    };

    const handleNotifications = () => {
        Alert.alert('Notifications', 'Toggle notification settings here.');
    };

    const handleBoost = () => {
        Alert.alert('Boost', 'Comming soon.');
    };

    const handleReviews = () => {
        Alert.alert('Reviews', 'Comming soon.');
    };

    const ExploreNewJobs = () => {
        navigation.navigate('ExploreNewJobs');
    }

    return (
        <>
            <CommonHeader title="Settings" />
            <View style={styles.container}>
                <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
                    <Text style={styles.buttonText}>Edit Profile</Text>
                </TouchableOpacity>
                {userData?.role == 'labour' && <>
                    <TouchableOpacity style={styles.button} onPress={ExploreNewJobs}>
                        <Text style={styles.buttonText}>Explore New Jobs </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleBoost}>
                        <Text style={styles.buttonText}>Boost Profile </Text>
                    </TouchableOpacity>
                </>
                }


                <TouchableOpacity style={styles.button} onPress={handleChangeLanguage}>
                    <Text style={styles.buttonText}>Change Language</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleNotifications}>
                    <Text style={styles.buttonText}>Notifications</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleReviews}>
                    <Text style={styles.buttonText}>Reviews</Text>
                </TouchableOpacity>




                <TouchableOpacity style={[styles.button, { backgroundColor: '#e74c3c' }]} onPress={logout}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
    button: {
        backgroundColor: '#052E5F',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        alignItems: 'center',
    },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '500' },
});
