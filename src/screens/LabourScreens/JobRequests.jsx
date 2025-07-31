import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import firestore, { collection, doc, getDocs, getFirestore, query, updateDoc, where } from '@react-native-firebase/firestore';
import { useAuth } from '../../components/AuthContext'; // Assuming you use a custom auth hook
import Loading from '../../components/Loading';
import CommonHeader from '../../components/CommonHeader';
import { firebase } from '@react-native-firebase/auth';
import AppText from '../../components/AppText';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-5562543184619525/1264436977';

// native ads// ca-app-pub-5562543184619525/3294321056
export default function JobRequestsScreen() {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);



    const fetchRequests = async () => {
        const firestore = getFirestore();
        try {
            const jobsRef = collection(firestore, 'jobsRequests');
            const q = query(jobsRef, where('labourId', '==', user.uid));
            // If you want to add orderBy later, just add it inside query()
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRequests(data);
            console.log('Jobdata', data)
        } catch (err) {
            console.log('Error fetching job requests:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchRequests();
        }
    }, [user]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchRequests(); // reuse your existing fetch logic
        setRefreshing(false);
    };

    const db = getFirestore();

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const requestRef = doc(db, 'jobsRequests', id);

            // Update status field
            await updateDoc(requestRef, { status: newStatus });

            // Update local state
            setRequests(prevRequests =>
                prevRequests.map(request =>
                    request.id === id ? { ...request, status: newStatus } : request
                )
            );

            console.log(`Status updated to '${newStatus}' for request ID: ${id}`);
        } catch (error) {
            console.error('Error updating job request status:', error);
        }
    };

    // if (loading) {
    //     return (
    //         <Loading />
    //     );
    // }

    return (
        <>
            <CommonHeader title={'Job Requests'} />
            {loading ? <Loading /> :
                <FlatList
                    onRefresh={onRefresh}
                    refreshing={refreshing}
                    contentContainerStyle={{ padding: 20 }}
                    data={requests}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            {/* <Text style={styles.title}>Skill: {item?.jobTitle}</Text> */}
                            <AppText style={styles.title} font='bold'>Employer Name: {item?.employerName}</AppText>
                            {/* <AppTextLocation: {item?.location}</Text> */}
                            {/* <AppTextSalary: {item?.salary}</Text> */}
                            <AppText>Date: {item.date?.toDate().toLocaleString()}</AppText>
                            <AppText>Status: {item?.status}</AppText >

                            {item?.status === 'pending' && (
                                <View style={styles.buttonRow}>
                                    <TouchableOpacity onPress={() => handleUpdateStatus(item.id, 'accepted')} style={styles.acceptBtn}>
                                        <AppText style={styles.btnText}>Accept</AppText>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleUpdateStatus(item.id, 'rejected')} style={styles.rejectBtn}>
                                        <AppText style={styles.btnText}>Reject</AppText>
                                    </TouchableOpacity>
                                </View>
                            )
                            }
                        </View >
                    )}
                    ListEmptyComponent={
                        <View style={{ alignItems: 'center', marginTop: 50 }}>
                            <Text style={{ fontSize: 16, color: 'gray' }}>
                                No job requests yet. Please check back later!
                            </Text>
                        </View >
                    }
                    ListFooterComponent={
                        <View style={{ alignItems: 'center', marginVertical: 10 }}>
                            <BannerAd
                                unitId={adUnitId}
                                size={BannerAdSize.BANNER}
                                requestOptions={{
                                    requestNonPersonalizedAdsOnly: true,
                                }}
                                onAdLoaded={() => console.log('Ad loaded')}
                                onAdFailedToLoad={(err) => console.log('Banner Ad Error', JSON.stringify(err))}

                            />
                        </View>}
                />
            }

        </>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        elevation: 2,
    },
    title: {

        fontSize: 16,
        marginBottom: 5,
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: 10,
    },
    acceptBtn: {
        flex: 1,
        backgroundColor: '#28a745',
        padding: 10,
        marginRight: 5,
        borderRadius: 5,
    },
    rejectBtn: {
        flex: 1,
        backgroundColor: '#dc3545',
        padding: 10,
        marginLeft: 5,
        borderRadius: 5,
    },
    btnText: {
        textAlign: 'center',
        color: '#fff',

    },
});
