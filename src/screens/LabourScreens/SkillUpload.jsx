import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Modal,
    TouchableOpacity
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import storage, { getDownloadURL } from '@react-native-firebase/storage';
import { useAuth } from '../../components/AuthContext';
import firestore, { serverTimestamp } from '@react-native-firebase/firestore'
import CommonButton from '../../components/CommonButton';
import Video from 'react-native-video';
import AppText from '../../components/AppText';

export default function SkillUploadScreen() {
    const [videoUri, setVideoUri] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const { user } = useAuth();
    const [uploadProgress, setUploadProgress] = useState(null);

    const pickVideo = async () => {
        const result = await launchImageLibrary({
            mediaType: 'video',
            videoQuality: 'low',
            durationLimit: 30,
        });

        if (result.didCancel || result.errorCode) {
            Alert.alert('Error', result.errorMessage || 'Video selection failed');
            return;
        }

        const video = result.assets[0];

        // if (video.duration && video.duration > 30) {
        //     Alert.alert('Error', 'Please select a video less than or equal to 30 seconds.');
        //     return;
        // }

        setVideoUri(video.uri);
        setModalVisible(true);
    };





    const uploadVideo = async () => {
        if (!videoUri || !user) return;

        setUploading(true);
        const fileName = `skills/${user.uid}_${Date.now()}.mp4`;
        const storageRef = storage().ref(fileName);

        const task = storageRef.putFile(videoUri);

        task.on('state_changed', taskSnapshot => {
            const percent = (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100;
            console.log(`Upload is ${percent.toFixed(0)}% done`);
            setUploadProgress(percent.toFixed(0)); // Track in state
        });

        try {
            await task;

            const downloadURL = await storageRef.getDownloadURL();

            await firestore()
                .collection('users')
                .doc(user.uid)
                .update({
                    skillVideos: firestore.FieldValue.arrayUnion(downloadURL),
                });
            await firestore().collection('videos').add({
                videoUrl: downloadURL,
                labourId: user.uid,
                likes: 0,
                likedBy: [],
                createdAt: serverTimestamp(),
            });

            Alert.alert('Success', 'Video uploaded successfully!');
            setVideoUri(null);
            setModalVisible(false);
        } catch (error) {
            console.error("Upload Failed:", error.message);
            Alert.alert('Upload Failed', error.message);
        } finally {
            setUploading(false);
            setUploadProgress(null);
        }
    };





    return (
        <View style={styles.container}>
            <AppText style={styles.title} font='bold'>Upload Your Skill Video</AppText>

            <CommonButton title={'Pick Video'} onPress={pickVideo} />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <AppText style={styles.previewText}>Preview Video</AppText>
                        <Video
                            source={{ uri: videoUri }}
                            style={styles.video}
                            resizeMode="contain"
                            controls
                        />

                        <CommonButton
                            disabled={uploading}
                            title={uploading ? <ActivityIndicator size={20} color="white" /> : "Upload Video"}
                            onPress={uploadVideo}
                        />
                        {uploadProgress !== null && (
                            <View style={{ width: '100%', height: 20, backgroundColor: '#ddd', borderRadius: 10, overflow: 'hidden', marginVertical: 10, justifyContent: 'center' }}>
                                {/* Filled portion of the bar */}
                                <View
                                    style={{
                                        width: `${uploadProgress}%`,
                                        height: '100%',
                                        backgroundColor: 'green',
                                    }}
                                />

                                {/* Centered overlay text */}
                                <View style={{ position: 'absolute', width: '100%', alignItems: 'center' }}>
                                    <AppText style={{ color: 'white', }}>{uploadProgress || 0}%</AppText>
                                </View>
                            </View>


                        )}
                        <TouchableOpacity onPress={() => { setModalVisible(false); setUploading(false) }}>
                            <AppText style={styles.closeText}>Close</AppText>
                        </TouchableOpacity>




                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    title: { fontSize: 20, marginBottom: 20 },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalContainer: {
        backgroundColor: 'white',
        margin: 20,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    previewText: { fontSize: 18, marginBottom: 10 },
    video: { width: 300, height: 200, marginBottom: 10 },
    closeText: { marginTop: 10, color: 'red' },
});
