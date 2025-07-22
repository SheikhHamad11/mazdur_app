import React, { useEffect, useState } from 'react';
import { View, Text, Switch, Alert } from 'react-native';
import { doc, getFirestore, onSnapshot, updateDoc } from '@react-native-firebase/firestore';
import { useAuth } from '../../components/AuthContext';
import { getAuth } from '@react-native-firebase/auth';
import AppText from '../../components/AppText';

export default function AvailabilityToggle() {
    const { user, userData } = useAuth();
    const [available, setAvailable] = useState(true);
    const [loading, setLoading] = useState(true);
    const db = getFirestore(); // Initialize Firestore
    const auth = getAuth();
    useEffect(() => {
        if (!user) return;

        const userDocRef = doc(db, 'users', user.uid);

        const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setAvailable(data?.available || false);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, [user]);

    const toggleAvailability = async () => {
        try {
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, { available: !available });
            setAvailable(!available);
        } catch (error) {
            Alert.alert('Error', 'Failed to update availability');
        }
    };

    if (loading) return null;

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
            <AppText style={{ fontSize: 18 }} font='bold'>Daily Availability</AppText>
            <Switch

                value={available}
                onValueChange={toggleAvailability}
                trackColor={{ false: '#ccc', true: '#4caf50' }}
                thumbColor={available ? '#fff' : '#fff'}
            />
            {/* <Text style={{ marginTop: 10 }}>{available ? 'You are Available' : 'Not Available Today'}</Text> */}
        </View>
    );
}
