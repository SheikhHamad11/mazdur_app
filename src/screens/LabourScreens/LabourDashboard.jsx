import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Switch, ActivityIndicator, FlatList, ScrollView } from 'react-native';
import { useAuth } from '../../components/AuthContext';
import auth from '@react-native-firebase/auth';
import Video from 'react-native-video'; // or use `react-native-video`
// import firestore from '@react-native-firebase/firestore';
import AvailabilityToggle from '../components/Availability';
import EchoLike from '../components/EchoLikes';
import Loading from '../../components/Loading';
import CommonHeader from '../../components/CommonHeader';
import { getFirestore, doc, getDoc } from '@react-native-firebase/firestore';
export default function LabourDashboard({ navigation }) {
    const { user, userData } = useAuth();
    // const [available, setAvailable] = useState(true);
    const [requests, setRequests] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
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
    }, [user]);
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
            <CommonHeader title="Laborer Dashboard" isfire={true} />

            <ScrollView  >
                <View style={styles.container}>
                    <Text style={styles.heading}>Welcome, {userData.name}</Text>

                    {userData?.photoURL ? (
                        <Image source={{ uri: userData?.photoURL }} style={{ width: 100, height: 100 }} />
                    ) : (
                        <Image source={require('../../assets/placeholder.png')} style={{ width: 100, height: 100 }} />
                    )}

                    <Text style={styles.label}>Skills:</Text>
                    <Text style={styles.value}>{userData?.skills}</Text>

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
                            {videos.map((item, index) => {

                                return <Video
                                    source={{ uri: item }}
                                    // use actual video URL
                                    style={styles.video}
                                    controls={true}
                                    paused={true}
                                    resizeMode="cover"
                                    onError={(e) => console.log('Video error:', e)}
                                />

                            })}

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
    video: { width: '100%', height: "500", marginBottom: 20 }
});
