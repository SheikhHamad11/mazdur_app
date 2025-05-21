import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import firestore, { collection, getDocs, getFirestore, orderBy, query, where } from '@react-native-firebase/firestore';
import { useAuth } from '../../components/AuthContext'; // Adjust if your path is different
import CommonHeader from '../../components/CommonHeader';
import auth, { getAuth } from '@react-native-firebase/auth';
import Loading from '../../components/Loading';
import CommonButton from '../../components/CommonButton';
export default function MyPostedJobsScreen() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const auth = getAuth(); // ✅ Modular auth
            const db = getFirestore(); // ✅ Modular firestore

            const user = auth.currentUser;
            const jobsRef = collection(db, 'jobs');
            const jobsQuery = query(
                jobsRef,
                // where('employerId', '==', user.uid)
                orderBy('postedAt', 'desc')
            );

            const snapshot = await getDocs(jobsQuery);
            const jobData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setJobs(jobData);
            { console.log('jobs', jobs) }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchJobs(); // reuse your existing fetch logic
        setRefreshing(false);
    };


    if (loading) {
        return <Loading />;
    }

    return (
        <>

            <FlatList onRefresh={onRefresh} refreshing={refreshing}
                data={jobs}
                ListHeaderComponent={<View style={{ padding: 0, margin: 0 }}><CommonHeader title={'NewJobsPosted'} /></View>}
                ListEmptyComponent={<Text style={{ padding: 16 }}>No jobs posted.</Text>}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.title}>Job Title:{item.title}</Text>
                        <Text style={styles.label}>Posted By: {item.employerId}</Text>
                        <Text>Job Description:{item.description}</Text>
                        <Text style={styles.label}>Location: {item.location}</Text>
                        <Text style={styles.label}>Salary: {item.salary}</Text>
                        <Text style={styles.label}>Date: {item.postedAt.toDate().toLocaleString()}</Text>
                        {/* <Text style={styles.status}>Status: {item.status}</Text> */}
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Apply</Text>
                        </TouchableOpacity>
                        {/* <CommonButton title={'Apply'} /> */}
                    </View>
                )}
            />
        </>


    );
}

const styles = StyleSheet.create({
    listContainer: {
        padding: 0,
    },
    card: {
        backgroundColor: '#f4f4f4',
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    label: {
        marginTop: 4,
        color: '#333',
    },
    status: {
        marginTop: 6,
        fontWeight: 'bold',
        color: '#007bff',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    emptyText: {
        fontSize: 16,
        color: '#777',
    }, button: {
        backgroundColor: '#052E5F',
        padding: 10,
        marginHorizontal: 20,
        borderRadius: 10,
        marginVertical: 15,
        alignItems: 'center',
    },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '500' },
});
