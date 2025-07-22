// src/screens/LabourProfile.js

import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import AppText from '../../components/AppText';
import Loading from '../../components/Loading';
import CommonHeader from '../../components/CommonHeader';

export default function LabourProfile({ route }) {
    const { labourId } = route.params;
    const [labour, setLabour] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLabour = async () => {
            try {
                const doc = await firestore().collection('users').doc(labourId).get();
                if (doc.exists) {
                    setLabour(doc.data());
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching labour data:', error);
                setLoading(false);
            }
        };

        fetchLabour();
    }, [labourId]);

    // if (loading) { return <Loading /> }

    // if (!labour) {
    //     return (
    //         <View style={styles.center}>
    //             <Text>No data found.</Text>
    //         </View>
    //     );
    // }

    return (
        <>
            <CommonHeader title="Labour Profile" />
            {loading ? (
                <Loading />) : <ScrollView contentContainerStyle={styles.container}>
                <Image source={{ uri: labour.photoURL || 'https://steela.ir/en/wp-content/uploads/2022/11/User-Avatar-in-Suit-PNG.png' }} style={styles.avatar} />
                <AppText style={styles.name}>{labour.name}</AppText>
                <AppText style={styles.bioTitle} font='medium'>Email</AppText>
                <AppText style={styles.bioText}>{labour.email}</AppText>
                <AppText style={styles.bioTitle} font='medium'>Phone</AppText>
                <AppText style={styles.bioText}> {labour.number || 'Not Provided'}</AppText>
                <AppText style={styles.bioTitle} font='medium'>Joined On</AppText>
                <AppText style={styles.bioText}>{labour.createdAt?.toDate().toLocaleDateString() || 'N/A'}</AppText>
                <AppText style={styles.bioTitle} font='medium'>Skills</AppText>
                <AppText style={styles.bioText}>{labour.skills || 'No skills listed.'}</AppText>
                <AppText style={styles.bioTitle} font='medium'>Address</AppText>
                <AppText style={styles.bioText}>{labour.address || 'No address provided.'}</AppText>
                <AppText style={styles.bioTitle} font='medium'>Echo Likes</AppText>
                <AppText style={styles.bioText}>{labour.echoLikes || 'Not Provided.'}</AppText>
                <AppText style={styles.bioTitle} font='medium'>Availability</AppText>
                <AppText style={styles.bioText}>{labour.available ? 'Available' : 'Not Available'}</AppText>
            </ScrollView >
            }

        </>

    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        borderBottomLeftRadius: 40,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 15,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    detail: {
        fontSize: 16,
        marginTop: 6,
    },
    bioTitle: {
        marginTop: 20,
        fontSize: 18,

        alignSelf: 'flex-start',
    },
    bioText: {
        marginTop: 8,
        fontSize: 16,
        textAlign: 'left',
        alignSelf: 'stretch',
    },
});
