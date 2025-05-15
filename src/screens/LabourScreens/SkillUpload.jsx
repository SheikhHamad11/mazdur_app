import React, { useState } from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import { useAuth } from '../../components/AuthContext';
import firestore from '@react-native-firebase/firestore';
import CommonButton from '../../components/CommonButton';
export default function SkillUploadScreen() {
    const [videoUri, setVideoUri] = useState(null);
    const [uploading, setUploading] = useState(false);
    const { user } = useAuth();

    const pickVideo = async () => {
        const result = await launchImageLibrary({
            mediaType: 'video',
        });

        if (result.didCancel) return;
        if (result.errorCode) {
            Alert.alert('Error', result.errorMessage || 'Video selection failed');
            return;
        }

        const video = result.assets[0];
        setVideoUri(video.uri);
    };

    const uploadVideo = async () => {
        if (!videoUri || !user) return;

        setUploading(true);
        const fileName = `skills/${user.uid}_${Date.now()}.mp4`;
        const ref = storage().ref(fileName);

        try {
            await ref.putFile(videoUri);
            const downloadURL = await ref.getDownloadURL();

            // Save to Firestore under current user
            await firestore()
                .collection('users')
                .doc(user.uid)
                .update({
                    skillVideos: firestore.FieldValue.arrayUnion(downloadURL),
                });

            Alert.alert('Success', 'Video uploaded successfully!');
            setVideoUri(null);
        } catch (error) {
            Alert.alert('Upload Failed', error.message);
        } finally {
            setUploading(false);
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Upload Your Skill Video</Text>


            <CommonButton title={'Pick Video'} onPress={pickVideo} />

            {videoUri && <Text style={styles.uriText}>Video selected</Text>}

            {uploading ? (
                <ActivityIndicator size="large" color="blue" style={{ marginTop: 20 }} />
            ) : (
                videoUri && <CommonButton title="Upload Video" onPress={uploadVideo} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    uriText: { marginTop: 10, fontStyle: 'italic', color: 'green' },
});
