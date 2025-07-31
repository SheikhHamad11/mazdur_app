import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, Text, FlatList, Dimensions, StyleSheet, TouchableOpacity, Pressable, Image, Alert, Modal, TextInput, ToastAndroid, Keyboard, StatusBar, Animated } from 'react-native';
import Video from 'react-native-video';
import { getFirestore, collection, getDocs, query, where, addDoc, serverTimestamp, doc, getDoc, deleteDoc, setDoc, orderBy, onSnapshot } from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import Loading from '../../components/Loading';
import { useAuth } from '../../components/AuthContext';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import AppText from '../../components/AppText';
import MyButton from '../../components/MyButton';


const { height } = Dimensions.get('window');
const interstitialAdUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-5562543184619525/8818144899';
const interstitial = InterstitialAd.createForAdRequest(interstitialAdUnitId, { requestNonPersonalizedAdsOnly: true });

const MazdoorTV = () => {
    const [videoList, setVideoList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [shownAds, setShownAds] = useState([]);
    const { userData, user } = useAuth();
    const db = getFirestore();

    const showAd = () => {
        interstitial.load();
        const loadedListener = interstitial.addAdEventListener(AdEventType.LOADED, () => {
            interstitial.show();
        });
        const closedListener = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
            loadedListener();
            closedListener();
        });
    };

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            const index = viewableItems[0].index;
            setCurrentIndex(index);
            if ((index === 4 || index === 10) && !shownAds.includes(index)) {
                setShownAds([...shownAds, index]);
                showAd();
            }
        }
    }).current;

    const shuffleArray = (array) =>
        array
            .map((item) => ({ item, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ item }) => item);

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
                                    photo: labour.photoURL,
                                },
                            });
                        }
                    }
                }
                setVideoList(shuffleArray(combined));
                setCurrentIndex(0);
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
                employerName: userData?.name,
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
        <FlatList
            keyboardShouldPersistTaps="handled"
            data={videoList}
            keyExtractor={(item, index) => `${item.videoUrl}_${index}`}
            renderItem={({ item, index }) => (
                <VideoCard
                    item={item}
                    isActive={index === currentIndex}
                    handleHire={handleHire}
                    employerId={user.uid}
                    userData={userData}
                />
            )}
            pagingEnabled
            snapToInterval={height}
            snapToAlignment="start"
            decelerationRate="fast"
            initialNumToRender={1}
            maxToRenderPerBatch={1}
            windowSize={2}
            removeClippedSubviews={true}
            showsVerticalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
            getItemLayout={(_, index) => ({ length: height, offset: height * index, index })}
        />
    );
};

const VideoCard = ({ item, isActive, handleHire, employerId, userData, }) => {
    const [status, setStatus] = useState('none');
    const [paused, setPaused] = useState(true);
    const videoRef = useRef(null);
    const isFocused = useIsFocused();
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [likedByUser, setLikedByUser] = useState(false);
    const [commentModalVisible, setCommentModalVisible] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);
    const [replyText, setReplyText] = useState('');
    const [replyToCommentId, setReplyToCommentId] = useState(null);
    const [replies, setReplies] = useState({});

    // { console.log('item.videoId', item.videoUrl) }
    const { user } = useAuth();
    const db = getFirestore();
    const videoId = item?.videoId || item?.videoUrl?.replace(/[^\w\s]/gi, '');
    useEffect(() => {
        setPaused(!isActive || !isFocused);
    }, [isActive, isFocused]);

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

        // const fetchLikes = async () => {
        //     try {
        //         const likesRef = collection(db, 'videos', videoId, 'likes');
        //         const likesSnapshot = await getDocs(likesRef);
        //         setLikesCount(likesSnapshot.size);

        //         const userLikeRef = doc(db, 'videos', videoId, 'likes', user.uid);
        //         const userLikeSnap = await getDoc(userLikeRef);
        //         setLiked(userLikeSnap.exists());
        //     } catch (error) {
        //         console.error('Error fetching likes:', error);
        //     }
        // };

        checkRequest();
        // fetchLikes();
    }, []);

    useEffect(() => {
        const likesRef = collection(db, 'videos', videoId, 'likes');

        const unsubscribe = onSnapshot(likesRef, (snapshot) => {
            setLikesCount(snapshot.size);

            const liked = snapshot.docs.some(doc => doc.id === user.uid);
            setLikedByUser(liked);
        });

        return () => unsubscribe(); // cleanup on unmount
    }, [videoId, user.uid]);



    useEffect(() => {
        const commentsRef = collection(db, 'videos', videoId, 'comments');
        const q = query(commentsRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setComments(data);
        });

        return () => unsubscribe();
    }, [videoId]);

    const postComment = async () => {
        const trimmedComment = commentText.trim();
        if (!trimmedComment) return;

        const tempComment = {
            id: Date.now(), // Temporary ID for UI
            userId: user.uid,
            comment: trimmedComment,
            userName: userData.name,
            userPhoto: userData.photoURL || 'https://steela.ir/en/wp-content/uploads/2022/11/User-Avatar-in-Suit-PNG.png',
            createdAt: new Date() // Add this so UI can sort/show immediately
        };

        // Optimistic UI update
        setComments(prev => [...prev, tempComment]);
        setCommentText('');
        Keyboard.dismiss();

        try {
            await addDoc(collection(db, 'videos', videoId, 'comments'), {
                userId: tempComment.userId,
                userName: tempComment.userName,
                userPhoto: tempComment.userPhoto,
                comment: tempComment.comment,
                createdAt: serverTimestamp()
            });
            console.log('Firestore comment posted successfully');
        } catch (error) {
            // Rollback optimistic comment on failure
            setComments(prev => prev.filter(c => c.id !== tempComment.id));
            Alert.alert('Error posting comment', error.message);
            console.error('Error posting comment:', error.message);
        }
    };


    const deleteComment = async (commentId) => {
        try {
            console.log('commentId', commentId)
            const commentDoc = doc(db, 'videos', videoId, 'comments', commentId);
            await deleteDoc(commentDoc);

            setComments(prev => prev.filter(comment => comment.id !== commentId));
            ToastAndroid.show('Comment deleted successfully', ToastAndroid.SHORT);
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    useEffect(() => {
        const likesRef = collection(db, 'videos', videoId, 'likes');
        const unsubscribe = onSnapshot(likesRef, snapshot => {
            setLikesCount(snapshot.size);
        });

        return () => unsubscribe();
    }, [videoId]);

    const scaleAnim = useRef(new Animated.Value(0)).current;
    const handleLike = async () => {
        const newLikedState = !likedByUser;
        setLikedByUser(newLikedState); // Optimistically update UI

        const likeRef = doc(db, 'videos', videoId, 'likes', user.uid);

        try {
            if (newLikedState) {
                await setDoc(likeRef, {
                    userId: user.uid,
                    userName: userData.name,
                    createdAt: serverTimestamp(),
                });
            } else {
                await deleteDoc(likeRef);
            }
        } catch (error) {
            // Roll back if something goes wrong
            setLikedByUser(!newLikedState);
            Alert.alert("Error", "Unable to update like status. Try again.");
            console.error("Failed to update like:", error.message);
        }

        // Animate heart scaling effect
        Animated.sequence([
            Animated.spring(scaleAnim, {
                toValue: 1.2,
                friction: 3,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 3,
                useNativeDriver: true,
            }),
        ]).start();
    };


    useEffect(() => {
        const fetchRepliesForComments = async () => {
            const allReplies = {};

            for (const comment of comments) {
                const repliesRef = collection(db, 'videos', videoId, 'comments', comment.id, 'replies');
                const repliesSnap = await getDocs(repliesRef);
                allReplies[comment.id] = repliesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            }

            setReplies(allReplies);
        };

        if (comments.length) fetchRepliesForComments();
    }, [comments]);


    const handleSendReply = async () => {
        const trimmedReply = replyText.trim();
        if (!trimmedReply || !replyToCommentId) return;

        const tempReply = {
            id: Date.now(), // Temporary unique ID for UI
            userId: user.uid,
            userName: userData.name,
            userPhoto: userData.photoURL || 'https://steela.ir/en/wp-content/uploads/2022/11/User-Avatar-in-Suit-PNG.png',
            reply: trimmedReply,
            createdAt: new Date()
        };

        // Optimistically update UI
        setReplies(prev => ({
            ...prev,
            [replyToCommentId]: [...(prev[replyToCommentId] || []), tempReply]
        }));
        setReplyText('');
        Keyboard.dismiss();

        try {
            await addDoc(
                collection(db, 'videos', videoId, 'comments', replyToCommentId, 'replies'),
                {
                    userId: tempReply.userId,
                    userName: tempReply.userName,
                    userPhoto: tempReply.userPhoto,
                    reply: tempReply.reply,
                    createdAt: tempReply.createdAt
                }
            );

            // Optionally: you can fetch or sync the latest reply from Firestore later
        } catch (error) {
            // Rollback optimistic reply on error
            setReplies(prev => ({
                ...prev,
                [replyToCommentId]: (prev[replyToCommentId] || []).filter(r => r.id !== tempReply.id)
            }));
            Alert.alert('Error', 'Reply not sent');
            console.error('Error posting reply:', error);
        }

        // Reset reply target
        setReplyToCommentId(null);
    };

    const handleDeleteReply = async (commentId, replyId) => {
        console.log('commentId', commentId, 'replyId', replyId);
        try {
            // Optimistically update UI
            setReplies(prev => ({
                ...prev,
                [commentId]: (prev[commentId] || []).filter(r => r.id !== replyId)
            }));

            // Try to delete from Firestore
            const replyRef = doc(db, 'videos', videoId, 'comments', commentId, 'replies', replyId);
            await deleteDoc(replyRef);
            ToastAndroid.show('Reply deleted', ToastAndroid.SHORT);
            console.log('Reply deleted from Firestore');
        } catch (error) {
            ToastAndroid.show('Failed to delete reply', ToastAndroid.SHORT);

            console.error('Error deleting reply:', error);
        }
    };



    const navigation = useNavigation()
    const totalcomments = comments.length + Object.values(replies).reduce((acc, replies) => acc + replies.length, 0);
    return (
        <View style={styles.card}>
            <Pressable onPress={() => { setPaused((p) => !p); }} style={{ flex: 1 }}>

                <Video
                    ref={videoRef}
                    source={{ uri: item?.videoUrl }}
                    style={styles.video}
                    paused={paused}
                    repeat
                    resizeMode="cover"
                    controls={false}
                    onError={(error) => {
                        const err = error?.nativeEvent?.error;
                        if (err) {
                            Alert.alert('Playback error', 'Video failed to play.');
                            console.error('Video error:', err);
                        }
                    }}

                />
                {paused &&
                    <Icon
                        pointerEvents="none" //
                        name={'play'}
                        size={70}
                        color="white"
                        style={{ position: 'absolute', alignSelf: 'center', top: '40%' }}
                    />}
                <Pressable style={{
                    position: 'absolute',
                    top: 20,
                    left: 20,
                }} onPress={() => navigation.navigate('LabourProfile', { labourId: item.labourId })}>
                    <Image
                        source={
                            item?.labourInfo.photo
                                ? { uri: item?.labourInfo.photo }
                                : require('../../assets/placeholder.png')
                        }
                        style={styles.avatar}

                    />
                </Pressable>
                {/* Like Button */}
                <View style={{ flexDirection: 'column', alignItems: 'center', position: 'absolute', top: 100, left: 30 }} >
                    <TouchableOpacity
                        onPress={handleLike}
                    >
                        <Icon name={'heart'} color={likedByUser ? 'red' : 'white'} size={35} />
                    </TouchableOpacity>
                    <AppText style={{ fontSize: 18, color: 'white' }}>{likesCount === null ? '' : likesCount}</AppText>
                </View>


                <View style={{ flexDirection: 'column', alignItems: 'center', position: 'absolute', top: 170, left: 30 }}>
                    <TouchableOpacity
                        onPress={() => setCommentModalVisible(true)}// or any unique ID you use
                    >
                        <Icon name="chatbubble-ellipses" size={30} color="#fff" />
                    </TouchableOpacity>
                    <AppText style={{ fontSize: 18, color: 'white' }}>
                        {totalcomments === null ? '' : totalcomments}
                    </AppText>
                </View>

            </Pressable>

            <View style={styles.infoContainer}>
                <AppText style={styles.name}>Name: {item?.labourInfo.name}</AppText>
                <AppText style={styles.skill}>Skills: {item?.labourInfo.skills}</AppText>
                {/* {userData?.role === 'employer' && (
                    <MyButton style={
                        {
                            backgroundColor:
                                status === 'none'
                                    ? '#052E5F'
                                    : status === 'accepted'
                                        ? 'green'
                                        : status === 'pending'
                                            ? 'gray'
                                            : 'red', marginVertical: 10
                        }}
                        title={status === 'none' ? 'Hire' : status.charAt(0).toUpperCase() + status.slice(1)} onPress={() => handleHire(item.labourId, item.labourInfo.name, setStatus)} />
                )} */}



                {/* <TouchableOpacity
                    disabled={item?.labourInfo.role === 'labour'}
                    onPress={() => { handleHire(item.labourId, item.labourInfo.name, setStatus); console.log('clicked'); }}
                    style={[
                        styles.hireButton,
                        {
                            backgroundColor:
                                status === 'none'
                                    ? 'blue'
                                    : status === 'accepted'
                                        ? 'green'
                                        : status === 'pending'
                                            ? 'gray'
                                            : 'red',
                        },
                        item?.labourInfo.role === 'labour' && styles.disabledButton,
                    ]}
                >
                    <AppText style={styles.buttonText}>
                        {status === 'none' ? 'Hire' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </AppText>
                </TouchableOpacity> */}
            </View>

            <Modal
                visible={commentModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setCommentModalVisible(false)}
            >
                <View style={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 10, marginTop: 200, borderTopLeftRadius: 30, borderTopRightRadius: 30 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{totalcomments} Comments</Text>
                        <TouchableOpacity onPress={() => setCommentModalVisible(false)} style={{ marginTop: 20 }}>
                            <Icon name="close" size={35} color="red" />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={comments}
                        ListEmptyComponent={<AppText style={{ textAlign: 'center', marginTop: 20 }}>No comments yet</AppText>}
                        keyExtractor={(item) => item.id}
                        keyboardShouldPersistTaps={'handled'}
                        renderItem={({ item }) => (
                            <View style={{ paddingVertical: 8, borderBottomColor: '#ccc', borderBottomWidth: 1 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image
                                        source={{ uri: item.userPhoto }}
                                        style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
                                    />
                                    <View style={{ flex: 1 }}>
                                        <AppText font="bold">{item.userName}</AppText>
                                        <AppText>{item.comment}</AppText>
                                        <AppText style={{ fontSize: 12, color: 'gray' }}>
                                            {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleString() : 'Just now'}
                                        </AppText>

                                        <View style={{ flexDirection: 'row', marginTop: 4 }}>
                                            <TouchableOpacity onPress={() => setReplyToCommentId(item.id)}>
                                                <AppText style={{ color: 'blue', marginRight: 10 }}>Reply</AppText>
                                            </TouchableOpacity>

                                            {item.userId === user.uid && (
                                                <TouchableOpacity onPress={() => deleteComment(item.id)}>
                                                    <AppText style={{ color: 'red' }}>Delete</AppText>
                                                </TouchableOpacity>
                                            )}
                                        </View>

                                        {/* REPLIES */}
                                        {replies[item.id]?.map(reply => (
                                            <View style={{ flexDirection: 'row', marginTop: 6 }} key={reply.id}>
                                                <Image
                                                    source={{ uri: reply.userPhoto }}
                                                    style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
                                                />
                                                <View style={{ flex: 1 }}>
                                                    <AppText font="bold">{reply.userName || 'Unknown user'}</AppText>
                                                    <AppText>{reply.reply || ''}</AppText>
                                                    <AppText style={{ fontSize: 12, color: 'gray' }}>
                                                        {reply.createdAt ? new Date(reply.createdAt.seconds * 1000).toLocaleString() : 'Just now'}
                                                    </AppText>
                                                    {/* Only show delete button if the user is the author */}
                                                    {reply.userId === user.uid && (
                                                        <Pressable onPress={() => handleDeleteReply(item.id, reply.id)}>
                                                            <Text style={{ color: 'red', marginTop: 4 }}>Delete</Text>
                                                        </Pressable>
                                                    )}
                                                </View>
                                            </View>
                                        ))}

                                        {/* REPLY INPUT */}
                                        {replyToCommentId === item.id && (
                                            <View style={{ flexDirection: 'row', marginTop: 6 }}>
                                                <TextInput
                                                    placeholder="Reply..."
                                                    placeholderTextColor={'gray'}
                                                    value={replyText}
                                                    onChangeText={setReplyText}
                                                    style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 8 }}
                                                />
                                                <TouchableOpacity onPress={handleSendReply} style={{ marginLeft: 8, padding: 8 }}>
                                                    <Icon name="send" size={20} color="blue" />
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </View>
                        )}
                    />


                    <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center' }}>
                        <TextInput
                            placeholder="Add a comment..."
                            placeholderTextColor={'gray'}
                            value={commentText}
                            onChangeText={setCommentText}
                            style={{
                                flex: 1,
                                borderWidth: 1,
                                borderColor: '#ccc',
                                borderRadius: 5,
                                padding: 10,
                            }}
                        />
                        <TouchableOpacity
                            onPress={postComment}
                            style={{ marginLeft: 10, padding: 10, backgroundColor: 'blue', borderRadius: 5 }}
                        >
                            <Icon name="send" size={20} color="white" />

                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    card: { width: '100%', height, backgroundColor: 'black' },
    video: { width: '100%', height: '100%', backgroundColor: '#000' },
    infoContainer: {
        position: 'absolute',
        bottom: 10,
        width: '100%',
        padding: 10,
        borderTopColor: 'white',
        borderTopWidth: 2,
        // borderBottomColor: '#ccc',
        // borderBottomWidth: 1,
    },
    name: { fontSize: 16, color: 'white' },
    skill: { fontSize: 14, color: 'white' },
    hireButton: {
        padding: 10,
        marginHorizontal: 10,
        marginTop: 5,
        borderRadius: 5,
        alignItems: 'center',
    },
    disabledButton: { backgroundColor: '#ccc' },
    buttonText: { color: 'white', },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,

        borderWidth: 2,
        borderColor: 'white',
    },
});

export default MazdoorTV;