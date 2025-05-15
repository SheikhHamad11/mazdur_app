import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator } from 'react-native';
import { getStorage, ref, uploadFile, getDownloadURL } from '@react-native-firebase/storage';
import { getFirestore, doc, updateDoc, getDoc } from '@react-native-firebase/firestore';
import { launchImageLibrary } from 'react-native-image-picker';
import { useAuth } from '../../components/AuthContext'; // make sure you have this hook set up
import Loading from '../../components/Loading';
import CommonHeader from '../../components/CommonHeader';

export default function EditProfile() {
    const { user, setUserData } = useAuth();
    const [skills, setSkills] = useState('');
    const [name, setName] = useState('')
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
                setSkills(data?.skills || '');
                setImageUri(data?.photoURL || '');
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
        setUploading(true);
        let photoURL = imageUri;

        const storage = getStorage();
        const firestore = getFirestore();

        if (imageUri && !imageUri.includes('https://')) {
            const imageRef = ref(storage, `profilePics/${user.uid}`);
            // uploadFile is the modular equivalent of putFile
            await uploadFile(imageRef, imageUri);
            photoURL = await getDownloadURL(imageRef);
        }

        const userRef = doc(firestore, 'users', user.uid);
        await updateDoc(userRef, {
            name,
            skills,
            photoURL,
        });
        // Optional: Refetch the updated data
        const updatedSnap = await getDoc(userRef);
        if (updatedSnap.exists()) {
            const updatedData = updatedSnap.data();
            setUserData(updatedData); // ✅ Update in context
        }
        Alert.alert('Success', 'Profile updated successfully');
        setUploading(false);
    };

    return (
        <>
            <CommonHeader title={'Edit profile'} />
            <View style={styles.container}>

                {/* <Text style={styles.title}>Edit Profile</Text> */}

                <TouchableOpacity onPress={pickImage}>
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} style={styles.avatar} />
                    ) : (
                        <Image source={require('../../assets/placeholder.png')} style={styles.avatar} />
                    )}
                </TouchableOpacity>
                <Text style={styles.label}>Name:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    placeholderTextColor={'gray'}
                    value={name}
                    onChangeText={setName}
                />
                <Text style={styles.label}>Skills</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Skills (e.g., Masonry, Electrician)"
                    placeholderTextColor={'gray'}
                    value={skills}
                    onChangeText={setSkills}
                />

                <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={uploading}>
                    <Text style={styles.saveButtonText}>{uploading ? <ActivityIndicator size={20} color={'white'} /> : 'Save Changes'}</Text>
                </TouchableOpacity>
            </View>
        </>

    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
        color: 'black'
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
    },
    label: {
        alignSelf: 'flex-start',
        fontSize: 16,
        marginBottom: 6,
        marginTop: 12,
        color: '#333',
    },
    saveButtonText: { color: '#fff', fontWeight: 'bold' },
});
