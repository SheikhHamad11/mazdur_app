import React, { useState } from 'react';
import { TextInput, Text, ScrollView, Image, Pressable, ActivityIndicator, Alert } from 'react-native';
import { styles } from './RegisterScreen';
import { getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';
import { getFirestore, doc, getDoc } from '@react-native-firebase/firestore';
import AppText from '../../components/AppText';
import MyInput from '../../components/MyInput';
export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setloading] = useState(false)

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }
        try {
            setloading(true);
            const auth = getAuth();
            const firestore = getFirestore();

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Get role from Firestore
            const userRef = doc(firestore, 'users', user.uid);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                const role = docSnap.data().role;

                if (role === 'labour') {
                    navigation.replace('LabourTabs');
                } else if (role === 'employer') {
                    navigation.replace('EmployerTabs');
                } else {
                    console.warn('Role not assigned!');
                }
                setloading(false)
            } else {
                setloading(false)
                console.warn('User data not found in Firestore!');
                Alert.alert('Error', 'User  not found ');
            }

        } catch (error) {
            setloading(false)
            console.error('Login error:', error.message);
            Alert.alert('Error', error.message)
        } finally {
            setloading(false);
        }
    };


    return (

        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps={'always'}>
            <Image source={require('../../assets/mazdur.png')} style={styles.image} />
            <AppText style={styles.title} font='bold'>Login Page</AppText>
            <MyInput header='Email' placeholder='Enter Your Email' placeholderTextColor={'gray'} value={email} onChangeText={setEmail} />
            <MyInput header='Password' placeholder='Enter Your Password' placeholderTextColor={'gray'} isPassword value={password} onChangeText={setPassword} isEye={true} />

            <Pressable style={styles.buttonContainer} onPress={handleLogin} >{loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <AppText style={{ color: 'white', textAlign: 'center' }}>Login</AppText>
            )}</Pressable>

            <Pressable style={styles.button2} onPress={() => navigation.navigate('Welcome')} >
                <AppText >Don't have an account? </AppText>
                <AppText font='bold' >Sign Up Here</AppText>
            </Pressable>
        </ScrollView >

    );
}

