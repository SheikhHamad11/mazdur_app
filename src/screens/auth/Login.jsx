import React, { useState } from 'react';
import { TextInput, Text, ScrollView, Image, Pressable, ActivityIndicator, Alert } from 'react-native';
import { styles } from './RegisterScreen';
import { getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';
import { getFirestore, doc, getDoc } from '@react-native-firebase/firestore';
export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setloading] = useState(false)



    const handleLogin = async () => {
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
            } else {
                console.warn('User data not found in Firestore!');
                Alert.alert('Error', 'User  not found ')
            }

        } catch (error) {
            console.error('Login error:', error.message);
        } finally {
            setloading(false);
        }
    };


    return (

        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps={'always'}>
            <Image source={require('../../assets/mazdur.png')} style={styles.image} />
            <Text style={styles.title}>Login Page</Text>
            <Text style={styles.label}>Enter Email</Text>
            <TextInput placeholder="123@gmail.com" placeholderTextColor={'gray'} value={email} onChangeText={setEmail} style={styles.input} />
            <Text style={styles.label}>Enter Password</Text>
            <TextInput placeholder="e.g#123456" placeholderTextColor={'gray'} secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />



            <Pressable style={styles.buttonContainer} onPress={handleLogin} >{loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text style={{ color: 'white', textAlign: 'center' }}>Login</Text>
            )}</Pressable>

            <Text style={{ color: 'black', textAlign: 'center', marginTop: 20 }}>Don't have an account</Text>
            <Pressable style={styles.buttonContainer} onPress={() => navigation.navigate('Register')} >

                <Text style={{ color: 'white', textAlign: 'center' }}>Sign Up Here</Text>
            </Pressable>
        </ScrollView>

    );
}

