import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Switch, ActivityIndicator, FlatList, ScrollView, Dimensions, Pressable } from 'react-native';
import { useAuth } from '../../components/AuthContext';
import auth from '@react-native-firebase/auth';
import Video from 'react-native-video'; // or use `react-native-video`
import Icon from 'react-native-vector-icons/MaterialIcons';
import PlayIcon from 'react-native-vector-icons/Ionicons';
import AvailabilityToggle from '../components/Availability';
import EchoLike from '../components/EchoLikes';
import Loading from '../../components/Loading';
import CommonHeader from '../../components/CommonHeader';
import { getFirestore, doc, getDoc, arrayRemove, updateDoc } from '@react-native-firebase/firestore';
import { deleteObject, getStorage } from '@react-native-firebase/storage';
const { width } = Dimensions.get('window')
export default function LabourDashboard({ navigation }) {
    const { user, userData } = useAuth();
    // const [available, setAvailable] = useState(true);
    const [requests, setRequests] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPlaying, setCurrentPlaying] = useState(null);

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

    const deleteSkillVideo = async (videoUrl) => {
        const firestore = getFirestore();
        const storage = getStorage();

        try {
            // Delete from Firestore
            const userRef = doc(firestore, 'users', user.uid);
            await updateDoc(userRef, {
                skillVideos: arrayRemove(videoUrl),
            });

            // Delete from Firebase Storage
            const videoRef = ref(storage, videoUrl);
            await deleteObject(videoRef);

            // Update local state
            setVideos(prev => prev.filter(url => url !== videoUrl));
        } catch (error) {
            console.error('Error deleting skill video:', error);
        }
    };
    // const onRefresh = async () => {
    //     setRefreshing(true);
    //     await userData(); // reuse your existing fetch logic
    //     setRefreshing(false);
    // };



    if (loading) {
        return (
            <Loading />
        );
    }

    return (
        <>
            <CommonHeader title="Labour Dashboard" isfire={true} />

            <ScrollView  >
                <View style={styles.container}>
                    <Text style={styles.heading}>Welcome, {userData.name}</Text>

                    {userData?.photoURL ? (
                        <Image source={{ uri: userData?.photoURL }} style={styles.avatar} />
                    ) : (
                        <Image source={require('../../assets/placeholder.png')} style={styles.avatar} />
                    )}

                    <Text style={styles.label}>Skills:</Text>
                    <Text style={styles.value}>{userData?.skills ? userData?.skills : 'Not added yet'}</Text>

                    <TouchableOpacity style={styles.uploadButton} onPress={() => navigation.navigate('SkillUpload')}>
                        <Text style={styles.uploadText}>Upload Skill Video</Text>
                    </TouchableOpacity>

                    <AvailabilityToggle />

                    <EchoLike userId={user?.uid} />


                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>My Skill Videos</Text>
                    {videos.length === 0 ? (
                        <Text>No videos uploaded yet.</Text>
                    ) : (
                        <>
                            <FlatList
                                data={videos}
                                keyExtractor={(item, index) => index.toString()}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.listContainer}
                                renderItem={({ item, index }) => {
                                    const isPlaying = currentPlaying === index;
                                    return (
                                        <Pressable style={styles.card} onPress={() => togglePlay(index)}>
                                            <Video
                                                source={{ uri: item }}
                                                style={styles.video}

                                                paused={!isPlaying}
                                                resizeMode="cover"
                                                onError={(e) => console.log('Video error:', e)}
                                            />

                                            <PlayIcon
                                                name={!isPlaying && 'play'}
                                                size={50}
                                                color="white"
                                                style={{ position: 'absolute', alignSelf: 'center', top: '40%', }}
                                            />
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 }}>
                                                <Text style={styles.caption}>Skill Video #{index + 1}</Text>
                                                <TouchableOpacity onPress={() => deleteSkillVideo(item)}>
                                                    <Icon name="delete" size={24} color="red" />
                                                </TouchableOpacity>
                                            </View>
                                        </Pressable>
                                    )

                                }}
                            />



                        </>
                    )}
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, alignItems: 'center', },
    heading: { fontSize: 24, fontWeight: 'bold', marginVertical: 20 },
    profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
    label: { fontSize: 16, fontWeight: '600' },
    value: { fontSize: 16, marginBottom: 10 },
    uploadButton: {
        backgroundColor: '#052E5F',
        padding: 10,
        borderRadius: 6,
        marginVertical: 10,
    },
    uploadText: { color: 'white', fontWeight: 'bold' },
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
    logoutText: { color: 'white', fontWeight: 'bold' },

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

});
