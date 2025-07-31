import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator, ScrollView } from 'react-native';
import firestore, { doc, getDoc, getFirestore } from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { useAuth } from '../../components/AuthContext'; // make sure you have this hook set up
import CommonHeader from '../../components/CommonHeader';
import AppText from '../../components/AppText';
import { Image as ImageCompressor } from 'react-native-compressor';
import MyButton from '../../components/MyButton';
export default function EditProfile() {
    const { user, userData } = useAuth();
    const [skills, setSkills] = useState('');
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [number, setNumber] = useState('')
    const [imageUri, setImageUri] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            const firestore = getFirestore();
            const userRef = doc(firestore, 'users', user.uid);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setName(data?.name || '');
                setEmail(data?.email || '');
                setSkills(data?.skills || '');
                setImageUri(data?.photoURL || '');
                setNumber(data?.number || '');
                // Use data here
            } else {
                console.warn('No such document!');
            }

        };
        loadProfile();
    }, [user]);

    const pickImage = async () => {
        const result = await launchImageLibrary({ mediaType: 'photo' });
        if (result.assets && result.assets.length > 0) {
            setImageUri(result.assets[0].uri);
        }
    };



    const handleSave = async () => {
        try {
            setUploading(true);
            let photoURL = imageUri;

            // Check if image is a local URI (i.e., not uploaded yet)
            if (imageUri && !imageUri.includes('https://')) {
                // ✅ Compress the image
                const compressedImage = await ImageCompressor.compress(imageUri, {
                    compressionMethod: 'auto',
                    quality: 0.7, // Adjust as needed
                });

                const ref = storage().ref(`profilePics/${user.uid}`);
                await ref.putFile(compressedImage);
                photoURL = await ref.getDownloadURL();
            }

            // ✅ Update user document in Firestore
            await firestore().collection('users').doc(user.uid).update({
                name,
                skills,
                photoURL,
                number
            });

            Alert.alert('Success', 'Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error.message);
            Alert.alert('Error', error.message);
        } finally {
            setUploading(false);
        }
    };


    return (
        <>
            <CommonHeader title={'Edit profile'} isBack={true} />
            <ScrollView style={styles.container}>

                <TouchableOpacity onPress={pickImage}>
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} style={styles.avatar} />
                    ) : (
                        <Image source={require('../../assets/placeholder.png')} style={styles.avatar} />
                    )}
                    <AppText style={styles.title}>Change Image 📷</AppText>
                </TouchableOpacity>
                <AppText style={styles.label}>Name:</AppText>

                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    placeholderTextColor={'gray'}
                    value={name}
                    onChangeText={setName}
                />
                <AppText style={styles.label}>Email:</AppText>
                <TextInput
                    editable={false}
                    style={[styles.input, { backgroundColor: 'lightgray' }]}
                    placeholder="Email"
                    placeholderTextColor={'gray'}
                    value={email}
                    onChangeText={setEmail}
                />
                {userData?.role == 'labour' &&
                    <>
                        <AppText style={styles.label}>Skills:</AppText>
                        <TextInput
                            style={styles.input}
                            placeholder="Skills (e.g., Masonry, Electrician)"
                            placeholderTextColor={'gray'}
                            value={skills}
                            onChangeText={setSkills}

                        />
                        <AppText style={styles.label}>Number:</AppText>

                        <TextInput
                            style={styles.input}
                            placeholder="Enter Number"
                            placeholderTextColor={'gray'}
                            value={number}
                            onChangeText={setNumber}
                        />
                    </>
                }
                <MyButton title={uploading ? <ActivityIndicator size={20} color={'white'} /> : 'Save Changes'} onPress={handleSave} disabled={uploading} />
                {/* <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={uploading}>
                    <AppText style={styles.saveButtonText}>{uploading ? <ActivityIndicator size={20} color={'white'} /> : 'Save Changes'}</AppText>
                </TouchableOpacity> */}
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 14, textAlign: 'center', marginBottom: 20 },
    input: {
        color: 'black',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
        fontFamily: "Metropolis-Light"
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        marginBottom: 20,
    },
    placeholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 20,
    },
    saveButton: {
        backgroundColor: '#27ae60',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 30
    },
    label: {
        alignSelf: 'flex-start',
        fontSize: 16,
        marginBottom: 6,
        marginTop: 12,
        color: '#333',
    },
    saveButtonText: { color: '#fff', },
});
