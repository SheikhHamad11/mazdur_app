import React, { useEffect, useState } from 'react';
import { View, Text, Switch, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../components/AuthContext';

export default function AvailabilityToggle() {
    const { user } = useAuth();
    const [available, setAvailable] = useState(false);
    const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     if (!user) return;

    //     const unsubscribe = firestore()
    //         .collection('users')
    //         .doc(user.uid)
    //         .onSnapshot(doc => {
    //             if (doc.exists) {
    //                 const data = doc.data();
    //                 setAvailable(data?.available || false);
    //             }
    //             setLoading(false);
    //         });

    //     return unsubscribe;
    // }, [user]);

    const toggleAvailability = async () => {
        try {
            await firestore()
                .collection('users')
                .doc(user.uid)
                .update({ available: !available });
            setAvailable(!available);
        } catch (error) {
            Alert.alert('Error', 'Failed to update availability');
        }
    };

    if (loading) return null;

    return (
        <View style={{ padding: 16, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 18 }}>Daily Availability</Text>
            <Switch

                value={available}
                onValueChange={toggleAvailability}
                trackColor={{ false: '#ccc', true: '#4caf50' }}
                thumbColor={available ? '#fff' : '#fff'}
            />
            <Text style={{ marginTop: 10 }}>{available ? 'You are Available' : 'Not Available Today'}</Text>
        </View>
    );
}
