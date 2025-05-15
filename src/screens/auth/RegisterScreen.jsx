import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Image, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../components/AuthContext';

export default function RegisterScreen({ navigation, route }) {
    const { role } = route.params || {};
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cnic, setCnic] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [confirmResult, setConfirmResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('')
    const { setUser } = useAuth()

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
        try {
            setLoading(true)
            const userCredential = await auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Save role to Firestore
            await firestore().collection('users').doc(user.uid).set({
                email,
                name,
                role,
                createdAt: firestore.FieldValue.serverTimestamp(),
            });
            setLoading(false)
            console.log('User registered and role saved!');
            navigation.navigate('Login'); // or 'Home'
        } catch (error) {
            setLoading(false)
            console.error('Signup error:', error.message);
        }
    };
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


    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps={'always'}>
            <Image source={require('../../assets/mazdur.png')} style={styles.image} />
            <Text style={styles.title}>Signup Page</Text>
            <Text style={styles.label}>Enter Name</Text>
            <TextInput placeholder="e.g John" placeholderTextColor={'gray'} value={name} onChangeText={setName} style={styles.input} />
            <Text style={styles.label}>Enter Email</Text>
            <TextInput placeholder="123@gmail.com" placeholderTextColor={'gray'} value={email} onChangeText={setEmail} style={styles.input} />
            <Text style={styles.label}>Enter Password</Text>
            <TextInput placeholder="e.g 123456" placeholderTextColor={'gray'} secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
            {/* <Text style={styles.label}>Enter CNIC</Text>
            <TextInput
                placeholder="12345-6789012-3"
                placeholderTextColor={'gray'}
                value={cnic}
                maxLength={15}
                onChangeText={handleCnicChange}
                keyboardType="numeric"
                style={styles.input}
            />

            <Text style={styles.label}>Enter Phone (without +92)</Text>
            <TextInput
                placeholder="03001234567"
                placeholderTextColor={'gray'}
                maxLength={11}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                style={styles.input}
            /> */}


            <Pressable style={styles.buttonContainer} onPress={handleSignUp} >{loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text style={{ color: 'white', textAlign: 'center' }}>SignUp</Text>
            )}</Pressable>

            <Text style={{ color: 'black', textAlign: 'center', marginTop: 20 }}>Already have account</Text>
            <Pressable style={styles.buttonContainer} onPress={() => navigation.navigate('Login')} >
                <Text style={{ color: 'white', textAlign: 'center' }}>Login Here</Text>
            </Pressable>




            {confirmResult && (
                <>
                    <Text style={styles.label}>Enter OTP</Text>
                    <TextInput
                        placeholder="123456"
                        placeholderTextColor={'gray'}
                        value={otp}
                        onChangeText={setOtp}
                        keyboardType="number-pad"
                        style={styles.input}
                    />
                    <Pressable style={styles.buttonContainer} onPress={verifyOtp} >{loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={{ color: 'white', textAlign: 'center' }}>Verify OTP</Text>
                    )}</Pressable>
                </>
            )}
        </ScrollView>
    );
};



export const styles = StyleSheet.create({
    container: {
        padding: 24,
        backgroundColor: '#f9f9f9',
        flexGrow: 1,
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        // marginBottom: 20,
    },
    label: {
        alignSelf: 'flex-start',
        fontSize: 16,
        marginBottom: 6,
        marginTop: 12,
        color: '#333',
    },
    input: {
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#aaa',
        paddingVertical: 8,
        paddingHorizontal: 4,
        fontSize: 16,
        marginBottom: 8,
        color: 'black'
    },
    buttonContainer: {
        width: '100%',
        marginTop: 16,
        padding: 12,
        backgroundColor: '#052E5F',
        borderRadius: 8
    },
    title: {
        textAlign: 'center',
        fontSize: 24, fontWeight: 'bold'
    }
});
