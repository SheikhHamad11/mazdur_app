import React, { useRef, useState } from 'react';
import {
    View,
    FlatList,
    Dimensions,
    StyleSheet,
    Pressable,
    Text,
    ToastAndroid,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import { arrayRemove, doc, getFirestore, updateDoc } from '@react-native-firebase/firestore';
import { deleteObject, getStorage, ref } from '@react-native-firebase/storage';
import { useAuth } from './AuthContext';
import { useIsFocused } from '@react-navigation/native';
const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const CARD_SPACING = 16;


const VideoCarousel = ({ videos, setVideos }) => {
    const [activeIndex, setActiveIndex] = useState(null); // All videos paused by default

    return (
        <FlatList
            data={videos}
            horizontal
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item, index }) => (
                <VideoCard
                    item={item}
                    index={index}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    setVideos={setVideos} // Pass setVideos to VideoCard
                />
            )}
            snapToInterval={CARD_WIDTH + CARD_SPACING}
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            contentContainerStyle={{ paddingHorizontal: CARD_SPACING }}
            initialNumToRender={1}
            maxToRenderPerBatch={1}
            windowSize={2}
            removeClippedSubviews={true}
        />
    );
};

const VideoCard = ({ item, index, activeIndex, setActiveIndex, setVideos }) => {
    const videoRef = useRef(null);
    const isPlaying = activeIndex === index;
    const { user } = useAuth();
    const isFocused = useIsFocused()


    const deleteSkillVideo = async (videoUrl) => {
        const firestore = getFirestore();
        const storage = getStorage();

        try {
            // Step 1: Remove from Firestore
            const userRef = doc(firestore, 'users', user.uid);
            await updateDoc(userRef, {
                skillVideos: arrayRemove(videoUrl),
            });

            // Step 2: Extract file path from download URL
            const match = decodeURIComponent(videoUrl).match(/\/o\/(.*?)\?alt=media/);
            if (!match || !match[1]) {
                throw new Error('Invalid download URL');
            }

            const filePath = match[1]; // e.g., "skills/abc123_1234567890.mp4"

            // Step 3: Delete from Firebase Storage
            const videoRef = ref(storage, filePath);
            await deleteObject(videoRef);
            // ✅ Show toast or alert
            ToastAndroid.show('Video deleted successfully', ToastAndroid.SHORT);
            // Step 4: Update local state
            setVideos(prev => prev.filter(url => url !== videoUrl));

        } catch (error) {
            console.error('Error deleting skill video:', error);
        }
    };
    return (
        <Pressable
            onPress={() => setActiveIndex(isPlaying ? null : index)}
            style={[
                styles.card,
            ]}
        >
            <Video
                ref={videoRef}
                source={{ uri: item }}
                style={styles.video}
                paused={!isPlaying || !isFocused} // All paused by default
                repeat
                resizeMode="cover"
                onError={(e) => console.log('Video error', e)}
            />

            {/* Play/Pause Icon */}
            <Icon
                name={!isPlaying ? 'play' : 'pause'}
                size={50}
                color="white"
                style={[styles.icon, { opacity: isPlaying ? 0 : 1 }]}
                pointerEvents="none"
            />

            <Text style={styles.caption}>Video #{index + 1}</Text>
            <Pressable
                style={{ position: 'absolute', bottom: 20, right: 10 }}
                onPress={() => deleteSkillVideo(item)}>
                <Icon name="trash-outline" size={24} color="red" />
            </Pressable>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        height: 400,
        marginRight: CARD_SPACING,
        borderRadius: 16,
        backgroundColor: '#ffa500',
        overflow: 'hidden',
        elevation: 4,
        transform: [{ rotate: '2deg' }],
    },
    video: {
        width: '100%',
        height: '100%',
    },
    icon: {
        position: 'absolute',
        top: '40%',
        alignSelf: 'center',
        opacity: 0.8,
    },
    caption: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 5,
    },
});

export default VideoCarousel;
