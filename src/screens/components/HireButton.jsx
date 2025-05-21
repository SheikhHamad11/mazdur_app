import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { getFirestore, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const HireButton = ({ labourId }) => {
    const [status, setStatus] = useState('none');
    const db = getFirestore();
    const auth = getAuth();
    const employerId = auth.currentUser?.uid;

    useEffect(() => {
        const checkRequestStatus = async () => {
            if (!employerId || !labourId) return;

            const q = query(
                collection(db, 'jobRequests'),
                where('employerId', '==', employerId),
                where('labourId', '==', labourId)
            );

            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                const data = snapshot.docs[0].data();
                setStatus(data.status); // e.g. 'pending', 'accepted'
            }
        };

        checkRequestStatus();
    }, [employerId, labourId]);

    const sendJobRequest = async () => {
        try {
            await addDoc(collection(db, 'jobRequests'), {
                employerId,
                labourId,
                status: 'pending',
                date: serverTimestamp(),
            });
            setStatus('pending');
        } catch (error) {
            console.error('Error sending job request:', error);
        }
    };

    return (
        <TouchableOpacity
            onPress={sendJobRequest}
            disabled={status !== 'none'}
            style={[
                styles.button,
                status !== 'none' && styles.disabledButton
            ]}
        >
            <Text style={styles.buttonText}>
                {status === 'none' ? 'Hire' : status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        marginTop: 10,
        backgroundColor: '#2e86de',
        padding: 10,
        borderRadius: 6,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#a4b0be',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default HireButton;
