import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, ScrollView, Dimensions, Pressable, ToastAndroid } from 'react-native';
import { useAuth } from '../../components/AuthContext';
import auth from '@react-native-firebase/auth';
import Video from 'react-native-video'; // or use `react-native-video`
import Icon from 'react-native-vector-icons/MaterialIcons';
import PlayIcon from 'react-native-vector-icons/Ionicons';
import AvailabilityToggle from '../components/Availability';
import EchoLike from '../components/EchoLikes';
import Loading from '../../components/Loading';
import { getFirestore, doc, getDoc, arrayRemove, updateDoc } from '@react-native-firebase/firestore';
import { deleteObject, getStorage, ref } from '@react-native-firebase/storage';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import SkillUploadScreen from './SkillUpload';
import AppText from '../../components/AppText';
import { useIsFocused } from '@react-navigation/native';
import HorizontalVideoCarousel from '../../components/HorizontalVideoCaresoul';
import MyButton from '../../components/MyButton';
const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-5562543184619525/8368830593';
// const adUnitId = TestIds.BANNER; // FOR DEBUGGING
export default function LabourDashboard({ navigation }) {
    const { user, userData } = useAuth();
    // const [available, setAvailable] = useState(true);
    const [requests, setRequests] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPlaying, setCurrentPlaying] = useState(null);
    const isFocused = useIsFocused();
    const togglePlay = (index) => {
        setCurrentPlaying(prev => (prev === index ? null : index));
    };


    useEffect(() => {
        if (!user) return;

        const fetchVideos = async () => {
            const firestore = getFirestore();
            try {
                const userRef = doc(firestore, 'users', user.uid);
                const docSnap = await getDoc(userRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setVideos(data?.skillVideos || []);
                    // Use data here
                } else {
                    console.warn('No such document videos!', error);
                }

            } catch (error) {
                console.log('Error loading videos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [user, userData]);


    // if (loading) {
    //     return (
    //         <Loading />
    //     );
    // }

    return (
        <>
            <View style={styles.header}>
                <AppText style={styles.headerTitle} font='bold' >
                    Welcome,{'\n'}Labour!
                </AppText>

                <View>
                    {userData?.photoURL ? (
                        <Image source={{ uri: userData?.photoURL }} style={styles.avatar} />
                    ) : (
                        <Image source={require('../../assets/placeholder.png')} style={styles.avatar} />
                    )}
                    <AppText style={[styles.value, { color: 'white', textAlign: 'center' }]}>{userData?.name}</AppText>
                </View>
            </View>
            {loading ? (
                <Loading />) : <ScrollView>
                <View style={styles.container}>

                    <AppText style={styles.label} font='bold'>My Skills:</AppText>
                    <AppText style={styles.value}>{userData?.skills ? userData?.skills : 'Not added yet'}</AppText>

                    <AvailabilityToggle />
                    <EchoLike userId={user?.uid} />
                    <MyButton title={'Watch Mazdoor TV'} onPress={() => navigation.navigate('MazdurTV')} />

                    <SkillUploadScreen />

                    <AppText style={{ fontSize: 18, marginBottom: 10 }} font='bold'>My Skill Videos</AppText>
                    {videos.length === 0 ? (
                        <AppText style={{ textAlign: 'center' }}>No videos uploaded yet.</AppText>
                    ) : (
                        // null
                        <HorizontalVideoCarousel videos={videos} setVideos={setVideos} />
                    )}
                </View>
                {/* Banner Ad */}
                <View style={{ alignItems: 'center', marginVertical: 20 }}>
                    <BannerAd
                        unitId={adUnitId}
                        size={BannerAdSize.BANNER}
                        requestOptions={{
                            requestNonPersonalizedAdsOnly: true,
                        }}
                        onAdLoaded={() => console.log('Ad loaded')}
                        onAdFailedToLoad={(err) => console.log('Banner Ad Error', JSON.stringify(err))}

                    />
                </View>
            </ScrollView>
            }

        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, gap: 10 },
    // heading: { fontSize: 24, marginVertical: 20 },
    // profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
    // label: { fontSize: 16, },
    // value: { fontSize: 16 },
    uploadButton: {
        backgroundColor: '#052E5F',
        padding: 15,
        width: '100%',
        borderRadius: 6,
        marginVertical: 10,
    },
    uploadText: { color: 'white', textAlign: 'center' },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginVertical: 10,
    },
    logoutButton: {
        marginTop: 30,
        padding: 10,
        backgroundColor: 'tomato',
        borderRadius: 6,
    },
    logoutText: { color: 'white', },

    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center'

    },
    listContainer: {
        paddingHorizontal: 16,
    },
    card: {
        width: 300,
        maxHeight: 500,
        marginRight: 16,
        borderRadius: 12,
        backgroundColor: 'white',
        overflow: 'hidden',
        // elevation: 4,
    },
    video: {
        width: '100%',
        height: 380,
        backgroundColor: '#000',
    },
    caption: {
        padding: 10,
        fontSize: 14,
        color: '#334155',
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
        fontSize: 28,
        color: 'white',
        marginTop: -10,
    },

});
