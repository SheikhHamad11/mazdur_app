import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth'
import { useAuth } from '../../components/AuthContext';
import CommonHeader from '../../components/CommonHeader';
import CommonButton from '../../components/CommonButton';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import AppText from '../../components/AppText';
import MyButton from '../../components/MyButton';
export default function EmployerDashboard() {
    const navigation = useNavigation();
    const { logout, userData } = useAuth();

    // Use real Ad Unit ID in production
    const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-5562543184619525/8368830593';

    return (
        <>
            {/* <CommonHeader title={'Employer Dashboard'} isfire={true} /> */}
            <View style={styles.header}>

                <AppText style={styles.headerTitle} font='bold'>
                    Welcome,{'\n'}Employer!
                </AppText>

                <View>
                    {userData?.photoURL ? (
                        <Image source={{ uri: userData?.photoURL }} style={styles.avatar} />
                    ) : (
                        <Image source={require('../../assets/placeholder.png')} style={styles.avatar} />
                    )}
                    <AppText style={{ color: 'white', textAlign: 'center' }} font='medium'>{userData?.name}</AppText>
                </View>
            </View>


            <ScrollView contentContainerStyle={styles.container}>

                <MyButton width='100%' title={'Post a Job'} onPress={() => navigation.navigate('PostJob')} />
                <MyButton width='100%' title={'My Posted Jobs'} onPress={() => navigation.navigate('Jobs Posted')} />
                <MyButton width='100%' title={'Watch Mazdoor TV'} onPress={() => navigation.navigate('MazdurTV')} />
                <MyButton width='100%' title={'Settings'} onPress={() => navigation.navigate('Settings')} />
            </ScrollView>
            {/* Banner Ad */}
            <View style={{ alignItems: 'center', marginVertical: 20 }}>
                <BannerAd
                    unitId={adUnitId}
                    size={BannerAdSize.BANNER}
                    requestOptions={{ requestNonPersonalizedAdsOnly: true }}
                />
            </View>
        </>

    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
        // backgroundColor: 'white',
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
    header: {
        backgroundColor: '#052E5F',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center', justifyContent: 'space-between',
        borderBottomRightRadius: 70,
        padding: 24,
        width: '100%',
        height: 150

    },

    headerTitle: {
        fontSize: 26,
        color: 'white',
        marginTop: -10,
    },
});
