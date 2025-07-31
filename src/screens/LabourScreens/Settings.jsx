import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import CommonHeader from '../../components/CommonHeader';
import { useAuth } from '../../components/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';
import AppText from '../../components/AppText';
import MyButton from '../../components/MyButton';

export default function LaborerSettings() {
    const navigation = useNavigation();
    const { logout, userData, user } = useAuth();

    const handleChangeLanguage = () => {
        Alert.alert('Language', 'Coming soon.');
        // navigation.navigate('LanguageSelector'); // create this screen if needed
    };
    const handleRateApp = () => {
        Linking.openURL('https://play.google.com/store/apps/details?id=com.mazdur_app')
            .catch(() => Alert.alert('Error', 'Unable to open store link.'));
    };

    return (
        <>
            <CommonHeader title="Settings" />
            <View style={styles.container}>
                {/* {isBoosted && <AppText🔥 Boost Active until: {formatDate(expiryDate)}</Text>} */}
                <MyButton onPress={() => navigation.navigate('EditProfile')} title={'Edit Profile'} />
                {userData?.role == 'labour' && <>
                    {/* <MyButton onPress={() => navigation.navigate('ExploreNewJobs')} title={'Explore New Jobs'} /> */}
                    <MyButton onPress={() => navigation.navigate('BoostProfile')} title={'Boost Profile 🚀'} />

                </>
                }
                <MyButton onPress={() => navigation.navigate('Notifications')} title={'Notifications'} />
                <MyButton onPress={() => navigation.navigate('About')} title={'About'} />
                <MyButton onPress={handleRateApp} title={'Rate & Review App'} />

                <TouchableOpacity style={[styles.button, { backgroundColor: '#e74c3c' }]} onPress={logout}>
                    <AppText style={styles.buttonText}>Logout</AppText>
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 24, marginBottom: 30 },
    button: {
        backgroundColor: '#052E5F',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        alignItems: 'center',
    },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '500' },
});


// import React, { useEffect, useRef, useState } from 'react';
// import { View, Text, FlatList, Dimensions, StyleSheet, TouchableOpacity, ActivityIndicator, Pressable, Image, RefreshControl, Alert } from 'react-native';
// import Video from 'react-native-video';
// import { getFirestore, collection, getDocs, doc, query, where, addDoc, serverTimestamp, getDoc } from '@react-native-firebase/firestore';
// import Icon from 'react-native-vector-icons/Ionicons';
// import Loading from '../../components/Loading';
// import { useAuth } from '../../components/AuthContext';
// import { useIsFocused } from '@react-navigation/native';
// const { height, width } = Dimensions.get('window');
// import {
//     InterstitialAd,
//     AdEventType,
//     TestIds,
// } from 'react-native-google-mobile-ads';

// const interstitialAdUnitId = __DEV__
//     ? TestIds.INTERSTITIAL
//     : 'ca-app-pub-5562543184619525/8818144899';
// const interstitial = InterstitialAd.createForAdRequest(interstitialAdUnitId, {
//     requestNonPersonalizedAdsOnly: true,
// });

// const MazdoorTV = () => {
//     const [videoList, setVideoList] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const viewabilityConfig = { itemVisiblePercentThreshold: 80 };
//     const [refreshing, setRefreshing] = useState(false);
//     const { userData, user } = useAuth();
//     const [shownAds, setShownAds] = useState([]);
//     const db = getFirestore();
//     // useEffect(() => {
//     //     interstitial.load();
//     //     const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
//     //         console.log('Interstitial ad loaded');
//     //         interstitial.show();
//     //     });

//     //     const adErrorListener = interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
//     //         console.error('Interstitial Ad error:', error);
//     //     });

//     //     const adCloseListener = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
//     //         console.log('Interstitial ad closed');
//     //     });



//     //     return () => {
//     //         unsubscribe();
//     //         adErrorListener();
//     //         adCloseListener();
//     //     };
//     // }, []);



//     const showAd = () => {
//         interstitial.load();

//         const listener = interstitial.addAdEventListener(AdEventType.LOADED, () => {
//             interstitial.show();
//         });

//         // Optional: clean up listener
//         interstitial.addAdEventListener(AdEventType.CLOSED, () => {
//             listener();
//         });
//     };

//     const onViewableItemsChanged = useRef(({ viewableItems }) => {
//         if (viewableItems.length > 0) {
//             const index = viewableItems[0].index;

//             setCurrentIndex(index); // ✅ This enables autoplay on scroll

//             if ((index === 3 || index === 8) && !shownAds.includes(index)) {
//                 setShownAds([...shownAds, index]);
//                 showAd();
//             }
//         }
//     }).current;





//     // Add this helper at the top of your file
//     const shuffleArray = (array) => {
//         return array
//             .map((item) => ({ item, sort: Math.random() }))
//             .sort((a, b) => a.sort - b.sort)
//             .map(({ item }) => item);
//     };


//     useEffect(() => {
//         const fetchVideosFromUsers = async () => {
//             try {
//                 const q = query(collection(db, 'users'), where('role', '==', 'labour'));
//                 const snapshot = await getDocs(q);
//                 let combined = [];
//                 for (const docSnap of snapshot.docs) {
//                     const labour = docSnap.data();
//                     const labourId = docSnap.id;

//                     if (Array.isArray(labour.skillVideos)) {
//                         for (const videoUrl of labour.skillVideos) {
//                             combined.push({
//                                 labourId,
//                                 videoUrl,
//                                 labourInfo: {
//                                     name: labour.name,
//                                     skills: labour.skills,
//                                     role: labour.role,
//                                     photo: labour.photoURL
//                                 },
//                             });
//                         }
//                     }
//                 }
//                 // ✅ Shuffle videos so they are not grouped by labour
//                 combined = shuffleArray(combined);
//                 setVideoList(combined);

//                 // ✅ Force play first video manually
//                 setCurrentIndex(0);

//             } catch (err) {
//                 console.error('Error fetching videos:', err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchVideosFromUsers();
//     }, []);

//     const handleHire = async (labourId, labourName, setStatus) => {
//         try {
//             await addDoc(collection(db, 'jobsRequests'), {
//                 employerName: userData?.name,
//                 labourId,
//                 labourName,
//                 status: 'pending',
//                 date: serverTimestamp(),
//             });
//             setStatus('pending');
//         } catch (error) {
//             console.error('Error sending job request:', error);
//         }
//     };

//     if (loading) return <Loading />;

//     return (
//         <>
//             <FlatList
//                 data={videoList}
//                 keyExtractor={(item, index) => `${item.videoUrl}_${index}`}

//                 renderItem={({ item, index }) => (
//                     <VideoCard item={item} isActive={index === currentIndex} handleHire={handleHire} employerId={user.uid} loading={loading} setLoading={setLoading} />
//                 )}
//                 pagingEnabled
//                 snapToInterval={height}
//                 snapToAlignment="start"
//                 decelerationRate="fast"
//                 initialNumToRender={1}
//                 maxToRenderPerBatch={1}
//                 windowSize={2}
//                 removeClippedSubviews={true}
//                 showsVerticalScrollIndicator={false}
//                 onViewableItemsChanged={onViewableItemsChanged}
//                 viewabilityConfig={viewabilityConfig}
//                 getItemLayout={(data, index) => (
//                     { length: height, offset: height * index, index }
//                 )}
//             // refreshControl={
//             //     <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//             // }
//             />
//         </>
//     );
// };




// const VideoCard = ({ item, isActive, handleHire, employerId }) => {
//     const [status, setStatus] = useState('none');
//     const [paused, setPaused] = useState(true);
//     const videoRef = useRef(null);
//     const isFocused = useIsFocused(); // 👈 this tells you if the screen is active
//     const [liked, setLiked] = useState(false);
//     const [likesCount, setLikesCount] = useState(0);

//     // Pause video if not the current visible one or screen/tab is unfocused
//     useEffect(() => {
//         if (!isActive || !isFocused) {
//             setPaused(true);
//         } else {
//             setPaused(false);
//         }
//     }, [isActive, isFocused]);


//     const togglePlayPause = () => {
//         setPaused(prev => !prev);
//     };

//     useEffect(() => {
//         const checkRequest = async () => {
//             const q = query(
//                 collection(db, 'jobsRequests'),
//                 where('employerId', '==', employerId),
//                 where('labourId', '==', item.labourId)
//             );
//             const snapshot = await getDocs(q);
//             if (!snapshot.empty) {
//                 const data = snapshot.docs[0].data();
//                 setStatus(data.status);
//             }
//         };
//         checkRequest();
//     }, []);

//     useEffect(() => {
//         return () => {
//             if (videoRef.current) {
//                 videoRef.current = null;
//             }
//         };
//     }, []);


//     return (
//         <View style={styles.card}>
//             <Pressable
//                 onPress={togglePlayPause}
//                 style={{ width: '100%', height: '100%' }}>
//                 {console.log('Playing video:', item?.videoUrl)}
//                 <Video
//                     ref={videoRef}
//                     source={{ uri: item?.videoUrl }}
//                     style={styles.video}
//                     paused={paused}
//                     // paused={!isActive || !isFocused}

//                     repeat
//                     resizeMode="cover"
//                     onError={(e) => {
//                         console.error('Video Error:', e);

//                         Alert.alert('Playback error', 'Video failed to play.');
//                     }}
//                     onEnd={() => {
//                         console.log("Video ended");
//                     }}

//                 />

//                 {paused && (
//                     <Icon
//                         name={'play'}
//                         size={50}
//                         color="white"
//                         style={{ position: 'absolute', alignSelf: 'center', top: '40%' }}
//                     />
//                 )}
//                 {item?.labourInfo.photo ? (
//                     <Image source={{ uri: item?.labourInfo.photo }} style={styles.avatar} />
//                 ) : (
//                     <Image source={require('../../assets/placeholder.png')} style={styles.avatar} />
//                 )}
//                 {/* // <TouchableOpacity style={{ position: 'absolute', top: 100 }} onPress={() => sendEchoLike(item.id, user.uid)}>
//                     <AppText style={{ fontSize: 18 }}>
//                         {liked ? '💖' : '🤍'} {likesCount}
//                     </AppText>
//                 </TouchableOpacity>// */}

//             </Pressable>
//             {/* {item.labour} */}
//             <View style={styles.infoContainer}>

//                 <AppText style={styles.name}>Name: {item?.labourInfo.name}</AppText>
//                 <AppText style={styles.skill}>Skills: {item?.labourInfo.skills}</AppText>
//                 <TouchableOpacity disabled={item?.labourInfo.role == 'labour'}
//                     onPress={() => handleHire(item.labourId, item.labourInfo.name, setStatus)}

//                     style={[styles.hireButton, {
//                         backgroundColor:
//                             status === 'none'
//                                 ? 'blue'
//                                 : status === 'accepted'
//                                     ? 'green'
//                                     : status === 'pending'
//                                         ? 'gray'
//                                         : 'red',
//                     }, item?.labourInfo.role == 'labour' && styles.disabledButton]}
//                 >
//                     <AppText style={styles.buttonText}>
//                         {status === 'none' ? 'Hire' : status.charAt(0).toUpperCase() + status.slice(1)}
//                     </AppText>
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     list: {
//         paddingBottom: 20,
//     },
//     card: {
//         width: '100%',
//         height: height,
//         // marginBottom: 20,
//         backgroundColor: 'black',


//     },
//     video: {
//         width: '100%',
//         height: '100%',
//         backgroundColor: '#000',
//     },
//     infoContainer: {
//         // borderRadius: 100,
//         position: 'absolute',
//         bottom: 10,
//         // left: '30%',
//         width: '100%',
//         padding: 10,
//         borderTopColor: 'white',
//         borderTopWidth: 2,
//         borderBottomColor: '#ccc',
//         borderBottomWidth: 1,
//     },
//     name: {
//         fontSize: 16,
//         ,
//         color: 'white'
//     },
//     skill: {
//         fontSize: 14,
//         color: 'white',

//     },
//     hireButton: {
//         // backgroundColor: 'green',
//         padding: 10,
//         marginHorizontal: 10,
//         marginTop: 5,
//         borderRadius: 5,
//         alignItems: 'center',
//     },
//     disabledButton: {
//         backgroundColor: '#ccc',
//     },
//     buttonText: {
//         color: 'white',
//         ,
//     },
//     avatar: {
//         width: 60,
//         height: 60,
//         borderRadius: 30,
//         position: 'absolute',
//         top: 20,
//         left: 20,
//         borderWidth: 2,
//         borderColor: 'white'
//     }
// });

// export default MazdoorTV;
