import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Image, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth'
import firestore, { serverTimestamp } from '@react-native-firebase/firestore';
import { getStorage } from '@react-native-firebase/storage';
import { useAuth } from '../../components/AuthContext';
import AppText from '../../components/AppText';
import MyInput from '../../components/MyInput';
import { launchImageLibrary } from 'react-native-image-picker';
import MyButton from '../../components/MyButton';
import { Image as ImageCompressor } from 'react-native-compressor';
export default function RegisterScreen({ navigation, route }) {
    const { role } = route.params || {};
    console.log('role', role)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [skills, setSkills] = useState('');
    // const [cnic, setCnic] = useState('');
    // const [phone, setPhone] = useState('');
    // const [otp, setOtp] = useState('');
    // const [confirmResult, setConfirmResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [address, setAddress] = useState('')
    const [photoURL, setPhotoURL] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0); // 0–100




    const pickImage = () => {
        launchImageLibrary({ mediaType: 'photo' }, response => {
            if (response.didCancel) return;
            if (response.errorMessage) {
                Alert.alert('Error', response.errorMessage);
                return;
            }
            const asset = response.assets[0];
            setPhotoURL(asset); // state variable
        });
    };

    // const sendOtp = async () => {
    //     if (!/^[0-9]{5}-[0-9]{7}-[0-9]{1}$/.test(cnic)) {
    //         Alert.alert('Warning', 'Invalid CNIC format');
    //         return;
    //     }

    //     try {
    //         setLoading(true);
    //         const confirmation = await auth().signInWithPhoneNumber('+92' + phone);
    //         setConfirmResult(confirmation);
    //         setLoading(false);
    //         Alert.alert('Success', 'OTP Sent!');
    //     } catch (error) {
    //         console.error(error);
    //         setLoading(false);
    //         Alert.alert('Failed to send OTP');
    //     }
    // };


    const handleSignUp = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (role === 'employer') {
            if (!name || !email || !password || !number) {
                Alert.alert('Error', 'Please fill in all required fields for Employer.');
                return;
            }
        } else if (role === 'labour') {
            if (!name || !email || !password || !number || !skills || !address) {
                Alert.alert('Error', 'Please fill in all required fields for Labour.');
                return;
            }
        } else {
            Alert.alert('Error', 'Invalid role selected.');
            return;
        }

        if (!emailRegex.test(email)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Weak Password', 'Password must be at least 6 characters long.');
            return;
        }

        if (!photoURL || !photoURL.uri) {
            Alert.alert('Error', 'Please upload a profile picture.');
            return;
        }

        let imageUrl = null;
        setLoading(true);
        setUploadProgress(0);

        try {
            // Step 1: Compress the image
            const compressedUri = await ImageCompressor.compress(photoURL.uri, {
                compressionMethod: 'auto',
                quality: 0.7,
            });

            const filename = `${email}_${Date.now()}.jpg`;
            const ref = getStorage().ref(`profilePics/${filename}`);

            // Step 2: Start uploading
            const uploadTask = ref.putFile(compressedUri);

            uploadTask.on('state_changed', taskSnapshot => {
                const percent = Math.round((taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100);
                setUploadProgress(percent);
            });

            await uploadTask;

            // Step 3: Get image URL
            imageUrl = await ref.getDownloadURL();

            // Step 4: Create user
            const userCredential = await auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            const userData = {
                email,
                name,
                role,
                number,
                photoURL: imageUrl,
                createdAt: serverTimestamp(),
            };

            if (role === 'labour') {
                userData.skills = skills;
                userData.address = address;
            }

            await firestore().collection('users').doc(user.uid).set(userData);

            setLoading(false);
            setUploadProgress(0);
            Alert.alert('Success', 'User registered successfully!');
        } catch (error) {
            console.error('Signup error:', error.message);
            Alert.alert('Error', error.message);
            setLoading(false);
            setUploadProgress(0);
        }
    };



    return (
        <ScrollView contentContainerStyle={styles.container} nestedScrollEnabled={true} showsVerticalScrollIndicator={false} scrollEnabled={true} keyboardShouldPersistTaps={'always'}>
            <Image source={require('../../assets/mazdur.png')} style={styles.image} />
            <AppText style={styles.title} font='bold'>Signup Page</AppText>
            {/* <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false} scrollEnabled={true} keyboardShouldPersistTaps={'always'}> */}
            {/* {role === undefined &&
                <MyInput header='Role' placeholder='Enter Your Role' placeholderTextColor={'gray'} value={role} />
            } */}


            <MyInput header='Name' placeholder='Enter Your Name' placeholderTextColor={'gray'} value={name} onChangeText={setName} />
            <MyInput header='Email' placeholder='Enter Your Email' placeholderTextColor={'gray'} value={email} onChangeText={setEmail} />
            <MyInput header='Password' placeholder='Enter Your Password' placeholderTextColor={'gray'} isPassword value={password} onChangeText={setPassword} isEye={true} />
            <MyInput header='Phone' placeholder='Enter Your Mobile Number' placeholderTextColor={'gray'} value={number} onChangeText={setNumber} keyboardType='phone-pad' />
            {role === 'labour' && <>
                <MyInput header='Skills' placeholder='Enter Your Skills' placeholderTextColor={'gray'} value={skills} onChangeText={setSkills} />
                <MyInput header='Address' placeholder='Enter Your Address' placeholderTextColor={'gray'} value={address} onChangeText={setAddress} />

            </>
            }


            <MyButton title={'Upload Profile Picture +'} titleColor='black' onPress={pickImage} style={{ marginTop: 20, backgroundColor: 'transparent', borderRadius: 10, borderColor: 'gray', borderWidth: 1 }} />


            {photoURL && <Image source={{ uri: photoURL.uri }} style={{ width: 100, height: 100 }} />}



            {/* <MyInput header='CNIC' placeholder='Enter Your CNIC (e.g., 12345-6789012-3)' placeholderTextColor={'gray'} value={cnic} onChangeText={setCnic} /> */}
            {/* <MyInput header='Phone' placeholder='Enter Your Phone (without +92)' placeholderTextColor={'gray'} value={phone} onChangeText={setPhone} keyboardType="phone-pad" /> */}

            <Pressable style={styles.buttonContainer} onPress={handleSignUp} >{loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <AppText style={{ color: 'white', textAlign: 'center' }}>SignUp</AppText>
            )}</Pressable>
            {loading && (
                <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBar, { width: `${uploadProgress}%` }]} />
                    <Text style={{ textAlign: 'center', color: 'black', position: 'absolute', width: '100%', alignItems: 'center' }}>{uploadProgress}%</Text>
                </View>
            )}

            <Pressable style={styles.button2} onPress={() => navigation.navigate('Login')} >
                <AppText >Already have account? </AppText>
                <AppText font='bold' >Login Here</AppText>
            </Pressable>

            {/* {confirmResult && (
                    <>
                        <MyInput header='OTP' placeholder='Enter Your OTP' placeholderTextColor={'gray'} value={otp} onChangeText={setOtp} keyboardType="number-pad" />
                        <Pressable style={styles.buttonContainer} onPress={verifyOtp} >{loading ? (
                            <ActivityIndicator color="#fff" />) : (
                            <AppText style={{ color: 'white', textAlign: 'center' }}>Verify OTP</AppText>
                        )}</Pressable>
                        <Pressable style={styles.button2} onPress={() => setConfirmResult(null)} >
                            <AppText >Resend OTP</AppText>
                        </Pressable>
                    </>
                )} */}
            {/* </ScrollView > */}
        </ScrollView>
    );
};



export const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: 'white',
        flexGrow: 1,
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        // marginBottom: 20,
    },

    progressBarContainer: {
        height: 20,
        width: '100%',
        backgroundColor: '#eee',
        borderRadius: 5,
        marginTop: 10,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#4caf50',
        borderRadius: 5,
    },
    buttonContainer: {
        width: '100%',
        marginTop: 16,
        padding: 12,
        backgroundColor: '#052E5F',
        borderRadius: 8
    },
    button2: {
        width: '100%',
        marginVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: '#052E5F',
        borderRadius: 8
    },
    title: {
        textAlign: 'center',
        fontSize: 24,
    }
});


// const handleCnicChange = (text) => {
//     // Remove all non-digit characters
//     const cleaned = text.replace(/\D/g, '');

//     let formatted = '';
//     if (cleaned.length <= 5) {
//         formatted = cleaned;
//     } else if (cleaned.length <= 12) {
//         formatted = `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
//     } else {
//         formatted = `${cleaned.slice(0, 5)}-${cleaned.slice(5, 12)}-${cleaned.slice(12, 13)}`;
//     }

//     setCnic(formatted);
// };


// const verifyOtp = async () => {
//     try {
//         setLoading(true);
//         const result = await confirmResult.confirm(otp);
//         const user = result.user;

//         await firestore().collection('users').doc(user.uid).set({
//             uid: user.uid,
//             phone: '+92' + phone,
//             cnic: cnic,
//             userType: role, // e.g., 'laborer' or 'employer'
//             createdAt: firestore.FieldValue.serverTimestamp(),
//         });
//         const userDoc = await firestore().collection('users').doc(user.uid).get();
//         const userType = userDoc.data().userType;

//         Alert.alert('Phone Verified & Data Saved');
//         setLoading(false);
//         if (userType === 'laborer') {
//             navigation.replace('LaborerDashboard');
//         } else {
//             navigation.replace('EmployerDashboard');
//         }

//     } catch (error) {
//         setLoading(false);
//         Alert.alert('Invalid OTP');
//     }
// };