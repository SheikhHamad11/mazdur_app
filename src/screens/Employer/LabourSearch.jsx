import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Image, Pressable } from 'react-native';
import firestore, { addDoc, onSnapshot, serverTimestamp } from '@react-native-firebase/firestore';
import CommonHeader from '../../components/CommonHeader';
import { useAuth } from '../../components/AuthContext';
import { getFirestore, collection, query, where, getDocs } from '@react-native-firebase/firestore';
import Loading from '../../components/Loading';
import AppText from '../../components/AppText';

import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-5562543184619525/2421605970';
export default function LaborSearchScreen({ navigation }) {
    const { user, userData } = useAuth()
    const [queiry, setQueiry] = useState('');
    const [laborers, setLaborers] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sentRequests, setSentRequests] = useState({});
    const db = getFirestore();

    useEffect(() => {
        const q = query(
            collection(db, 'jobsRequests'),
            where('employerId', '==', user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const updatedStatuses = {};
            snapshot.forEach(doc => {
                const data = doc.data();
                updatedStatuses[data.labourId] = data.status; // e.g., 'pending' or 'accepted'
            });
            setSentRequests(updatedStatuses); // This updates UI based on latest status
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchLaborers = async () => {
            try {
                const db = getFirestore(); // Get Firestore instance
                const q = query(
                    collection(db, 'users'),
                    where('role', '==', 'labour')
                );
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(docSnap => ({
                    id: docSnap.id,
                    ...docSnap.data(),
                }));

                setLaborers(data);
                setFiltered(data);
                console.log({ data });
            } catch (err) {
                console.log('Error fetching laborers:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchLaborers();
    }, []);

    const handleSearch = (text) => {
        setQueiry(text);
        const filteredResults = laborers.filter((item) =>
            item.name?.toLowerCase().includes(text.toLowerCase()) ||
            item.skills?.includes(text.toLowerCase())
        );
        setFiltered(filteredResults);

    };
    const sendJobRequest = async (labourId) => {
        try {
            const db = getFirestore(); // Initialize Firestore instance

            await addDoc(collection(db, 'jobsRequests'), {
                labourId,
                employerName: userData.name,
                status: 'pending',
                date: serverTimestamp(),
            });
            // Mark this labourId as requested
            setSentRequests(prev => ({ ...prev, [labourId]: 'pending' }));


            alert('Job request sent!');
        } catch (err) {
            console.error('Error sending job request:', err);
        }
    };

    const renderLaborer = ({ item }) => (

        <View style={styles.card}>
            <View style={{ flexDirection: 'row', gap: 5 }}>
                <Pressable onPress={() => navigation.navigate('LabourProfile', { labourId: item.id })} style={{ width: '30%', gap: 10 }}>
                    {item?.photoURL ? (
                        <Image source={{ uri: item?.photoURL }} style={styles.image} />
                    ) : (
                        <Image source={require('../../assets/placeholder.png')} style={styles.image} />
                    )}
                    <AppText style={{ textAlign: 'center', color: 'black', fontSize: 14 }} font='medium'>View Profile</AppText>
                    {/* <MyButton title={'View Profile'} titleStyle={{ fontSize: 10, color: 'blue', }} width={100} style={{ backgroundColor: 'transparent' }} /> */}
                </Pressable>
                <View style={{ width: '70%' }}>
                    <AppText style={styles.name} font='bold'>Name:{item.name}</AppText>
                    <AppText>Email: {item?.email}</AppText>
                    <AppText>Skills: {item?.skills}</AppText>
                    <AppText>Phone: {item?.number}</AppText>
                    <AppText>Address: {item?.address}</AppText>
                    <AppText>Status: {item?.available ? 'Available' : 'Not Available'}</AppText>
                </View>
            </View >

            <TouchableOpacity
                style={[styles.button, { backgroundColor: sentRequests[item.id] === 'pending' ? 'gray' : sentRequests[item.id] === 'accepted' ? 'green' : '#007bff' }]}
                onPress={() => sendJobRequest(item.id)}
                disabled={sentRequests[item.id] === 'pending' || sentRequests[item.id] === 'accepted'} // ✅ explicit boolean
            >
                <AppText style={styles.buttonText}> {sentRequests[item.id] === 'accepted' ? 'Accepted' : sentRequests[item.id] === 'pending' ? 'Requested' : 'Send Request'}</AppText>
            </TouchableOpacity>
        </View >
    );


    // if (loading) return <Loading />;

    return (
        <>
            <CommonHeader title={'LabourSearch'} />
            {loading ? (
                <Loading />) : <View style={styles.container}>

                <TextInput
                    placeholder="Search by skill or name"
                    placeholderTextColor={'gray'}
                    value={queiry}
                    onChangeText={handleSearch}
                    style={styles.searchInput}
                />

                {filtered.length === 0 ? (
                    <AppText style={styles.noResult}>No matching laborers found.</AppText>
                ) : (
                    <FlatList
                        ListFooterComponent={<View style={{ alignItems: 'center', marginVertical: 10 }}>
                            <BannerAd
                                unitId={adUnitId}
                                size={BannerAdSize.BANNER}
                                requestOptions={{ requestNonPersonalizedAdsOnly: true }}
                                onAdLoaded={() => console.log('Ad loaded')}
                                onAdFailedToLoad={err =>
                                    console.log('Banner Ad Error', JSON.stringify(err))
                                }
                            />
                        </View>}
                        data={filtered}
                        keyExtractor={(item) => item.id}
                        renderItem={renderLaborer}
                        contentContainerStyle={{ paddingBottom: 20 }}

                    />
                )}
            </View>}

        </>
    );
}


const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 16, paddingTop: 10 },
    searchInput: {
        padding: 12,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 12,
        borderColor: '#ccc',
        fontFamily: 'Metropolis-Light',
    },
    card: {
        padding: 16,
        backgroundColor: '#eee',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 10,
    },

    button: {
        marginTop: 10,
        padding: 10,
        borderRadius: 8,
    },
    buttonText: { color: '#fff', textAlign: 'center' },
    noResult: {
        marginTop: 20,
        textAlign: 'center',
        color: '#666',
        fontSize: 16,
    },
    image: {
        width: 100, height: 100, borderRadius: 50
    }
});
