import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
    getFirestore,
    increment,
    orderBy,
} from '@react-native-firebase/firestore';
import { useAuth } from '../../components/AuthContext';
import CommonHeader from '../../components/CommonHeader';
import Loading from '../../components/Loading';
import AppText from '../../components/AppText';

export default function MyPostedJobsScreen() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [appliedJobIds, setAppliedJobIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [applyLoadingJobId, setApplyLoadingJobId] = useState(null);
    const db = getFirestore();

    useEffect(() => {
        fetchJobs();
        fetchAppliedJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const jobsRef = collection(db, 'jobs');
            const jobsQuery = query(jobsRef, orderBy('postedAt', 'desc'));
            const snapshot = await getDocs(jobsQuery);
            const jobData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setJobs(jobData);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAppliedJobs = async () => {
        try {
            const q = query(
                collection(db, 'applications'),
                where('labourId', '==', user.uid)
            );
            const snapshot = await getDocs(q);
            const appliedIds = snapshot.docs.map(doc => ({
                jobId: doc.data().jobId,
                docId: doc.id,
            }));
            setAppliedJobIds(appliedIds);
        } catch (error) {
            console.error('Error fetching applied jobs:', error);
        }
    };

    const applyToJob = async jobId => {
        try {
            setApplyLoadingJobId(jobId);
            await addDoc(collection(db, 'applications'), {
                jobId,
                labourId: user.uid,
                appliedAt: new Date(),
            });

            await updateDoc(doc(db, 'jobs', jobId), {
                applicantsCount: increment(1),
            });

            setAppliedJobIds(prev => [...prev, { jobId }]);
            console.log('Applied to job successfully');
        } catch (error) {
            console.error('Error applying to job:', error);
        } finally {
            setApplyLoadingJobId(null);
        }
    };

    const cancelApplication = async jobId => {
        try {
            setApplyLoadingJobId(jobId);
            // Find the correct application doc to delete
            const q = query(
                collection(db, 'applications'),
                where('jobId', '==', jobId),
                where('labourId', '==', user.uid)
            );
            const snapshot = await getDocs(q);
            snapshot.forEach(async docSnap => {
                await deleteDoc(doc(db, 'applications', docSnap.id));
            });

            await updateDoc(doc(db, 'jobs', jobId), {
                applicantsCount: increment(-1),
            });

            setAppliedJobIds(prev => prev.filter(job => job.jobId !== jobId));
            console.log('Application cancelled');
        } catch (error) {
            console.error('Error cancelling application:', error);
        } finally {
            setApplyLoadingJobId(null);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchJobs();
        await fetchAppliedJobs();
        setRefreshing(false);
    };

    const isApplied = jobId => {
        return appliedJobIds.some(job => job.jobId === jobId);
    };

    // if (loading) return <Loading />;

    return (
        <>
            <CommonHeader title={'New Jobs'} />
            {loading ? <Loading /> : <FlatList
                onRefresh={onRefresh}
                refreshing={refreshing}
                data={jobs}

                ListEmptyComponent={<AppText style={{ padding: 16 }}>No jobs posted.</AppText>}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <AppText style={styles.title} font='bold'>Job Title: {item.title}</AppText>
                        <AppText style={styles.label}>Posted By: {item?.employerName}</AppText>
                        {/* <AppText>Job Description: {item.description}</AppText> */}
                        <AppText style={styles.label}>Location: {item.location}</AppText>
                        <AppText style={styles.label}>Salary: {item.salary}</AppText>
                        <AppText style={styles.label}>
                            Date: {item.postedAt.toDate().toLocaleString()}
                        </AppText>

                        {isApplied(item.id) ? (
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: 'gray' }]}
                                onPress={() => cancelApplication(item.id)}
                                disabled={applyLoadingJobId === item.id}
                            >
                                <AppText style={styles.buttonText}>
                                    {applyLoadingJobId === item.id ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        'Cancel'
                                    )}
                                </AppText>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => applyToJob(item.id)}
                                disabled={applyLoadingJobId === item.id}
                            >
                                <AppText style={styles.buttonText}>
                                    {applyLoadingJobId === item.id ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        'Apply'
                                    )}
                                </AppText>
                            </TouchableOpacity>
                        )}
                    </View >
                )
                }
            />}

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
        margin: 12,
        elevation: 2,
    },
    title: {
        fontSize: 18,

    },
    label: {
        marginTop: 4,
        color: '#333',
    },
    button: {
        backgroundColor: '#052E5F',
        padding: 10,
        marginHorizontal: 20,
        borderRadius: 10,
        marginVertical: 15,
        alignItems: 'center',
    },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '500' },
});
