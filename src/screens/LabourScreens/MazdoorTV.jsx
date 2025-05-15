import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    View,
    FlatList,
    Text,
    StyleSheet,
    Dimensions,
    Pressable,
    Animated,
    Share,
    Alert,
    Image,
    PanResponder,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';

import { useFocusEffect } from '@react-navigation/native';
import { getFirestore, doc, getDoc, getDocs, query, collection, where } from '@react-native-firebase/firestore';
const videoData = [
    { id: '1', title: 'Video 1', url: require('../../assets/3.mp4') },
    { id: '2', title: 'Video 2', url: require('../../assets/video3.mp4') },
    { id: '3', title: 'Video 3', url: require('../../assets/video2.mp4') },
    { id: '4', title: 'Video 4', url: require('../../assets/1.mp4') },
    // Add more sample data
];
const { width, height } = Dimensions.get('window');

export default MazdoorTVScreen = ({ navigation }) => {
    const [currentVideoId, setCurrentVideoId] = useState(null);
    const viewabilityConfig = { itemVisiblePercentThreshold: 80 }; // 80% visibility triggers play
    const [progress, setProgress] = useState(0);
    const [pausedVideos, setPausedVideos] = useState({});
    const [likedVideos, setLikedVideos] = useState({}); // Track liked videos
    const [likeCounts, setLikeCounts] = useState(
        videoData.reduce((acc, video) => ({ ...acc, [video.id]: 0 }), {}),
    );
    const [commentModalVisible, setCommentModalVisible] = useState(false); // Modal visibility for comments
    const [currentComment, setCurrentComment] = useState(''); // Track current comment input
    const [videoComments, setVideoComments] = useState({}); // Track comments for each video
    const [commentCounts, setCommentCounts] = useState({});
    const [bookmarkCounts, setBookmarkCounts] = useState({});
    const [isBookmarked, setIsBookmarked] = useState({});
    const scaleAnim = useRef(new Animated.Value(1)).current; // For heart animation
    const videoRefs = useRef([]);
    const [isPlaying, setIsPlaying] = useState(true);
    const [videos, setVideos] = useState([]);
    const [labours, setLabours] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLabours = async () => {
            const firestore = getFirestore()
            try {
                const usersRef = collection(firestore, 'users');
                const q = query(usersRef, where('role', '==', 'labour'));

                const snapshot = await getDocs(q);

                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                // const snapshot = await firestore()
                //     .collection('users')
                //     .where('role', '==', 'labour')
                //     .get();

                // const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                // console.log({ labours: labours[0].skillVideos });

                setLabours(data);
            } catch (err) {
                console.error('Error fetching labour videos:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchLabours();
    }, []);
    useFocusEffect(
        useCallback(() => {
            // Screen gains focus: play all videos or the active one
            // videoRefs.current.forEach(ref => {
            //   if (ref) ref.play(); // Ensure `play()` method exists for your video player
            // });

            return () => {
                // Screen loses focus: pause all videos
                videoRefs.current.forEach(ref => {
                    if (ref) ref.pause(); // Ensure `pause()` method exists for your video player
                });
            };
        }, []),
    );

    // Callback to handle viewable items
    const onViewableItemsChanged = useCallback(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            const visibleItem = viewableItems[0];
            const videoId = visibleItem.item.id;

            // Set the current video ID
            setCurrentVideoId(videoId);

            // Reset video playback position
            if (videoRefs.current[visibleItem.index]) {
                videoRefs.current[visibleItem.index].seek(0);
            }

            // Set the video to play if it was previously paused
            setPausedVideos(prevState => ({
                ...prevState,
                [videoId]: false, // Set the video to play when it's visible
            }));
        }
    }, []);

    const updateProgress = progress => {
        setProgress(progress); // Update sticky progress bar
    };

    // Handle like button press
    const handleLikePress = videoId => {
        const newLikedVideos = { ...likedVideos };
        const newLikeCounts = { ...likeCounts };

        if (newLikedVideos[videoId]) {
            delete newLikedVideos[videoId]; // Un-like if already liked
            newLikeCounts[videoId] = newLikeCounts[videoId] - 1; // Decrease count
        } else {
            newLikedVideos[videoId] = true; // Like the video
            newLikeCounts[videoId] = newLikeCounts[videoId] + 1; // Increase count
        }

        setLikedVideos(newLikedVideos);
        setLikeCounts(newLikeCounts);

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

    const handleCommentPress = videoId => {
        setCurrentVideoId(videoId); // Set current video for comments
        pan.setValue(0);
        setCurrentComment(''); // Clear input field
        // Set to your desired color
        setCommentModalVisible(true); // Open comment modal
        // changeNavigationBarColor('white', false);
    };

    const handleCommentSubmit = () => {
        if (!currentComment.trim()) return; // Avoid submitting empty comments

        const newComments = { ...videoComments };
        if (!newComments[currentVideoId]) {
            newComments[currentVideoId] = [];
        }
        newComments[currentVideoId].push(currentComment);
        setVideoComments(newComments);

        // Update the comment count
        setCommentCounts(prevCounts => ({
            ...prevCounts,
            [currentVideoId]: (prevCounts[currentVideoId] || 0) + 1,
        }));

        setCurrentComment('');
        // setCommentModalVisible(false);
    };

    const handleBookmarkToggle = videoId => {
        setIsBookmarked(prevBookmarks => {
            const isCurrentlyBookmarked = prevBookmarks[videoId] || false;
            const newBookmarkStatus = {
                ...prevBookmarks,
                [videoId]: !isCurrentlyBookmarked,
            };

            // Update the bookmark count based on the new status
            setBookmarkCounts(prevCounts => ({
                ...prevCounts,
                [videoId]: newBookmarkStatus[videoId]
                    ? (prevCounts[videoId] || 0) + 1 // Increase if bookmarked
                    : Math.max((prevCounts[videoId] || 1) - 1, 0), // Decrease if unbookmarked, but not below 0
            }));

            return newBookmarkStatus;
        });
    };

    const pan = useRef(new Animated.Value(0)).current;

    // PanResponder to handle the drag gesture
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (e, gestureState) => {
                if (gestureState.dy > 0) {
                    pan.setValue(gestureState.dy); // Only drag down
                }
            },
            onPanResponderRelease: (e, gestureState) => {
                if (gestureState.dy > 100) {
                    // If dragged down more than 100 pixels, close modal
                    setCommentModalVisible(false);
                } else {
                    Animated.spring(pan, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        }),
    ).current;

    return (
        <View style={styles.container}>
            {/* {labours[0]?.skillVideos?.map((item, index) => {

                return <Video
                    source={{ uri: item }}
                    // use actual video URL
                    style={{ width: '100%', height: 300 }}
                    controls={true}
                    paused={true}
                    resizeMode="cover"
                    onError={(e) => console.log('Video error:', e)}
                />

            })} */}
            <FlatList
                showsVerticalScrollIndicator={false}
                data={labours[1]?.skillVideos}
                keyExtractor={item => item.id}
                renderItem={({ item, index }) => (
                    <VideoItem
                        key={index}
                        item={item}
                        currentVideoId={currentVideoId}
                        onProgressUpdate={updateProgress}
                        videoRef={ref => {
                            videoRefs.current[index] = ref;
                        }}
                        isPaused={pausedVideos[item.id] || false} // Check if the video is paused
                        onPause={() =>
                            setPausedVideos(prevState => ({ ...prevState, [item.id]: true }))
                        } // Pause video
                        onPlay={() =>
                            setPausedVideos(prevState => ({ ...prevState, [item.id]: false }))
                        } // Play video
                        onLikePress={handleLikePress} // Handle like button press
                        isLiked={likedVideos[item.id]} // Check if the video is liked
                        scaleAnim={scaleAnim} // Animation for the heart
                        onCommentPress={handleCommentPress} // Handle comment button press
                        comments={videoComments[item.id] || []} // Display current video comments
                        likeCounts={likeCounts}
                        commentCounts={commentCounts}
                        bookmarkCounts={bookmarkCounts}
                        handleBookmarkToggle={handleBookmarkToggle}
                        isBookmarked={isBookmarked}
                    />
                )}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                pagingEnabled
                onMomentumScrollEnd={event => {
                    const index = Math.round(event.nativeEvent.contentOffset.y / height);
                    setCurrentVideoId(videoData[index]?.id);
                }}
            />
            {/* Sticky progress bar */}
            <View style={styles.stickyProgressBarContainer}>
                <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
            </View>

            {/* Modal for Comment Section */}
            {/* <CommentsModal /> */}

        </View>
    );
};

const VideoItem = ({
    item,
    currentVideoId,
    onProgressUpdate,
    videoRef,
    onPause,
    onPlay,
    isPaused,
    onLikePress,
    isLiked,
    onCommentPress,
    scaleAnim,
    likeCounts,
    commentCounts,
    handleBookmarkToggle,
    bookmarkCounts,
    isBookmarked,
}) => {
    const { width } = Dimensions.get('window');
    const videoHeight = width * (16 / 9); // Adjust for aspect ratio

    const handleProgress = data => {
        if (data.seekableDuration > 0) {
            const progressPercent = data.currentTime / data.seekableDuration;
            if (item.id === currentVideoId) {
                onProgressUpdate(progressPercent); // Update sticky progress bar for the current video
            }
        }
    };

    const onShare = async () => {
        try {
            const result = await Share.share({
                message: `This is the video number ${item.id}`,
                url: item.url,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    return (
        <View style={styles.videoContainer}>
            <View
                style={{ width: '100%', height: videoHeight, justifyContent: 'center' }}>
                <Pressable
                    onPress={() => (isPaused ? onPlay() : onPause())}
                    style={{ width: '100%', height: videoHeight }}>
                    <Video
                        ref={videoRef}
                        source={{ uri: item }}
                        style={{ width: width, height: videoHeight }}
                        resizeMode="contain" // This preserves the aspect ratio
                        repeat
                        paused={currentVideoId !== item.id || isPaused}
                        onProgress={handleProgress}
                    />
                    {isPaused && (
                        <Icon
                            name={'play'}
                            size={50}
                            color="white"
                            style={{ position: 'absolute', alignSelf: 'center', top: '50%' }}
                        />
                    )}
                </Pressable>
                <View style={{ position: 'absolute', bottom: 40, right: -10, gap: 10 }}>
                    <Image source={require('../../assets/img.jpg')} style={styles.image} />
                    {/* Like Button */}
                    <Pressable
                        onPress={() => onLikePress(item.id)}
                        style={styles.likeButton}>
                        <Animated.View
                            style={{ transform: [{ scale: scaleAnim }], alignItems: 'center' }}>
                            <Icon
                                name={'heart'} // Filled or empty heart depending on like state
                                size={35}
                                color={isLiked ? 'red' : 'white'}
                            />
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>
                                {likeCounts[item.id] || 0}
                            </Text>
                        </Animated.View>
                    </Pressable>

                    {/* Comment Button */}
                    <Pressable
                        onPress={() => onCommentPress(item.id)}
                        style={styles.commentButton}>
                        <Icon name="reader" size={30} color="white" />
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>
                            {commentCounts[item.id] || 0}
                        </Text>
                    </Pressable>

                    {/* Bookmark Button */}
                    <Pressable
                        onPress={() => handleBookmarkToggle(item.id)}
                        style={styles.bookmarkButton}>
                        <Icon
                            name="bookmark"
                            size={30}
                            color={isBookmarked[item.id] ? 'yellow' : 'white'}
                        />
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>
                            {bookmarkCounts[item.id] || 0}
                        </Text>
                    </Pressable>

                    {/* Bookmark Button */}
                    <Pressable onPress={onShare} style={styles.shareButton}>
                        <Icon name="arrow-redo" size={30} color={'white'} />
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>100</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'black', alignItems: 'center' },
    videoContainer: { marginVertical: 20, alignItems: 'center' },
    progressBarContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: '#d3d3d3', // Background color of the progress bar
    },
    stickyProgressBarContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: '#d3d3d3',
        zIndex: 2, // Ensure the progress bar stays on top
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#ff0000',
    },
    image: {
        // position: 'absolute',
        // bottom: '60%',
        right: 20,
        width: 40,
        height: 40,
        borderRadius: 50,
    },
    likeButton: {
        // position: 'absolute',
        // bottom: '50%',
        right: 20,
        zIndex: 1,
    },
    commentButton: {
        // position: 'absolute',
        // bottom: '40%',
        right: 20,
        zIndex: 1,
        alignItems: 'center',
    },
    bookmarkButton: {
        // position: 'absolute',
        // bottom: '30%',
        right: 20,
        zIndex: 1,
        alignItems: 'center',
    },
    shareButton: {
        // position: 'absolute',
        // bottom: '10%',
        right: 20,
        zIndex: 1,
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 5,
    },
    closeText: {
        fontSize: 18,
        color: 'black',
    },
    commentsContainer: {
        position: 'absolute',
        bottom: 120,
        left: 20,
        right: 20,
        zIndex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 10,
        borderRadius: 10,
    },
    commentText: {
        color: 'white',
        fontSize: 14,
        marginBottom: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        height: '70%',
        width: '100%',
        alignSelf: 'center',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        // margin: 20,
    },
    inputContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    commentsList: {
        maxHeight: 200,
        marginVertical: 20,
    },
    commentText: {
        fontSize: 16,
        color: 'black',
        marginBottom: 5,
        marginVertical: 10,
    },
    noCommentsText: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
    },
    commentInput: {
        borderColor: 'gray',
        borderBottomWidth: 1,
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        color: 'black',
        flex: 1,
    },
    submitButton: {
        backgroundColor: 'black',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
    },
    submitText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
