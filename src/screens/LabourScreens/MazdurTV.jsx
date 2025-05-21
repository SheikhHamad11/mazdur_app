import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, Dimensions, StyleSheet, TouchableOpacity, ActivityIndicator, Pressable, Image, RefreshControl } from 'react-native';
import Video from 'react-native-video';
import { getFirestore, collection, getDocs, doc, query, where, addDoc, serverTimestamp, getDoc } from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';
import Loading from '../../components/Loading';
import { useAuth } from '../../components/AuthContext';
import { useIsFocused } from '@react-navigation/native';
const { height, width } = Dimensions.get('window');
const videoHeight = width * (16 / 9);
const db = getFirestore();
const auth = getAuth();

import {
    InterstitialAd,
    AdEventType,
    TestIds,
} from 'react-native-google-mobile-ads';


const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL, {
    requestNonPersonalizedAdsOnly: true,
});

const MazdoorTV = () => {
    const [videoList, setVideoList] = useState([]);
    const [loading, setLoading] = useState(true);
    const employerId = auth.currentUser?.uid;
    const [currentIndex, setCurrentIndex] = useState(0);
    const viewabilityConfig = { itemVisiblePercentThreshold: 80 };
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
            interstitial.show();
        });

        interstitial.load();

        return () => {
            unsubscribe();
        };
    }, []);

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems && viewableItems.length > 0) {
            console.log('Currently visible index:', viewableItems[0].index); // ✅
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            const firestore = getFirestore();
            const userRef = doc(firestore, 'users', user.uid);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setVideoList(data?.skillVideos || []);
            } else {
                console.warn('No such document videos!');
            }
        } catch (error) {
            console.log('Error refreshing videos:', error);
        } finally {
            setRefreshing(false);
        }
    };


    // Add this helper at the top of your file
    const shuffleArray = (array) => {
        return array
            .map((item) => ({ item, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ item }) => item);
    };

    useEffect(() => {
        const fetchVideosFromUsers = async () => {
            try {
                const q = query(collection(db, 'users'), where('role', '==', 'labour'));
                const snapshot = await getDocs(q);
                let combined = [];
                for (const docSnap of snapshot.docs) {
                    const labour = docSnap.data();
                    const labourId = docSnap.id;

                    if (Array.isArray(labour.skillVideos)) {
                        for (const videoUrl of labour.skillVideos) {
                            combined.push({
                                labourId,
                                videoUrl,
                                labourInfo: {
                                    name: labour.name,
                                    skills: labour.skills,
                                    role: labour.role,
                                    photo: labour.photoURL
                                },
                            });
                        }
                    }
                }
                // ✅ Shuffle videos so they are not grouped by labour
                combined = shuffleArray(combined);
                setVideoList(combined);
            } catch (err) {
                console.error('Error fetching videos:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchVideosFromUsers();
    }, []);

    const handleHire = async (labourId, labourName, setStatus) => {
        try {
            await addDoc(collection(db, 'jobsRequests'), {
                employerId,
                labourId,
                labourName,
                status: 'pending',
                date: serverTimestamp(),
            });
            setStatus('pending');
        } catch (error) {
            console.error('Error sending job request:', error);
        }
    };

    if (loading) return <Loading />;

    return (
        <>
            <FlatList
                data={videoList}
                keyExtractor={(item, index) => `${item.labourId}_${index}`}
                renderItem={({ item, index }) => (
                    <VideoCard item={item} isActive={index === currentIndex} handleHire={handleHire} employerId={employerId} loading={loading} setLoading={setLoading} />
                )}
                pagingEnabled
                snapToInterval={height}
                snapToAlignment="start"
                decelerationRate="fast"
                initialNumToRender={2}
                maxToRenderPerBatch={2}
                windowSize={3}
                removeClippedSubviews={true}
                showsVerticalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                getItemLayout={(data, index) => (
                    { length: height, offset: height * index, index }
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </>
    );
};




const VideoCard = ({ item, isActive, handleHire, employerId }) => {
    const [status, setStatus] = useState('none');
    const [paused, setPaused] = useState(false);
    const videoRef = useRef(null);
    const isFocused = useIsFocused(); // 👈 this tells you if the screen is active
    // Pause video if not the current visible one or screen/tab is unfocused
    useEffect(() => {
        if (!isActive || !isFocused) {
            setPaused(true);
        } else {
            setPaused(false);
        }
    }, [isActive, isFocused]);



    const togglePlayPause = () => {
        setPaused(prev => !prev);
    };

    useEffect(() => {
        const checkRequest = async () => {
            const q = query(
                collection(db, 'jobsRequests'),
                where('employerId', '==', employerId),
                where('labourId', '==', item.labourId)
            );
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                const data = snapshot.docs[0].data();
                setStatus(data.status);
            }
        };

        checkRequest();
    }, []);


    return (
        <View style={styles.card}>

            <Pressable key={item.index}
                onPress={togglePlayPause}
                style={{ width: '100%', height: videoHeight }}>
                <Video
                    ref={videoRef}
                    source={{ uri: item?.videoUrl }}
                    style={styles.video}
                    paused={paused}
                    repeat
                    resizeMode="cover"
                />
                {paused && (
                    <Icon
                        name={'play'}
                        size={50}
                        color="white"
                        style={{ position: 'absolute', alignSelf: 'center', top: '50%' }}
                    />
                )}
                {item?.labourInfo.photo ? (
                    <Image source={{ uri: item?.labourInfo.photo }} style={styles.avatar} />
                ) : (
                    <Image source={require('../../assets/placeholder.png')} style={styles.avatar} />
                )}
            </Pressable>
            {/* {item.labour} */}
            <View style={styles.infoContainer}>

                <Text style={styles.name}>Name: {item?.labourInfo.name}</Text>
                <Text style={styles.skill}>Skills: {item?.labourInfo.skills}</Text>
                <TouchableOpacity disabled={item?.labourInfo.role == 'labour'}
                    onPress={() => handleHire(item.labourId, item.labourInfo.name, setStatus)}
                    // disabled={status !== 'none'}
                    style={[styles.hireButton, item?.labourInfo.role == 'labour' && styles.disabledButton]}
                >
                    <Text style={styles.buttonText}>
                        {status === 'none' ? 'Hire' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    list: {
        paddingBottom: 20,
    },
    card: {
        width: '100%',
        // marginBottom: 20,
        backgroundColor: 'black',



    },
    video: {
        width: width,
        height: videoHeight,
        backgroundColor: '#000',
    },
    infoContainer: {
        // borderRadius: 100,
        padding: 10,
        borderTopColor: 'white',
        borderTopWidth: 2,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white'
    },
    skill: {
        fontSize: 14,
        color: 'white',

    },
    hireButton: {
        backgroundColor: '#2e86de',
        padding: 10,
        marginHorizontal: 10,
        marginTop: 5,
        borderRadius: 5,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        position: 'absolute',
        top: 20,
        left: 20,
        borderWidth: 2,
        borderColor: 'white'
    }
});

export default MazdoorTV;
