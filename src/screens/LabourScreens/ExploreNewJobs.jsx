import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ToastAndroid,
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
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import MyInput from '../../components/MyInput';
import App from '../../../App';

const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-5562543184619525/2421605970';

export default function MyPostedJobsScreen() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [appliedJobIds, setAppliedJobIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [applyLoadingJobId, setApplyLoadingJobId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const db = getFirestore();
    // { console.log('jobs', jobs) }
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
            setFilteredJobs(jobData); // Initially show all
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
            ToastAndroid.show('Applied successfully!', ToastAndroid.SHORT);
            setAppliedJobIds(prev => [...prev, { jobId }]);
        } catch (error) {
            console.error('Error applying to job:', error);
        } finally {
            setApplyLoadingJobId(null);
        }
    };

    const cancelApplication = async jobId => {
        try {
            setApplyLoadingJobId(jobId);
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

            ToastAndroid.show('Application cancelled successfully!', ToastAndroid.SHORT);
            setAppliedJobIds(prev => prev.filter(job => job.jobId !== jobId));
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

    const handleSearch = text => {
        setSearchQuery(text);
        const lower = text.toLowerCase();
        const filtered = jobs.filter(job =>
            job.title?.toLowerCase().includes(lower) ||
            job.location?.toLowerCase().includes(lower)
        );
        setFilteredJobs(filtered);
    };

    return (
        <>
            <CommonHeader title={'New Jobs'} />



            {loading ? <Loading /> : (
                <>
                    <View style={styles.container}>
                        <TextInput
                            placeholder="Search by Job title or location"
                            placeholderTextColor="#888"
                            style={styles.searchInput}
                            value={searchQuery}
                            onChangeText={handleSearch}

                        />

                        <FlatList
                            onRefresh={onRefresh}
                            refreshing={refreshing}
                            data={filteredJobs}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <AppText style={{ padding: 16 }}>No jobs found.</AppText>
                            }
                            ListFooterComponent={
                                <View style={{ alignItems: 'center', marginVertical: 10 }}>
                                    <BannerAd
                                        unitId={adUnitId}
                                        size={BannerAdSize.BANNER}
                                        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
                                        onAdLoaded={() => console.log('Ad loaded')}
                                        onAdFailedToLoad={err =>
                                            console.log('Banner Ad Error', JSON.stringify(err))
                                        }
                                    />
                                </View>
                            }
                            keyExtractor={item => item.id}

                            renderItem={({ item }) => (
                                <View style={styles.card}>
                                    <AppText style={styles.title} font="bold">
                                        Job Title: {item.title}
                                    </AppText>
                                    <AppText style={styles.label}>Posted By: {item?.employerName}</AppText>
                                    <AppText style={styles.label}>Location: {item.location}</AppText>
                                    <AppText style={styles.label}>Salary: {item.salary}</AppText>
                                    <AppText style={styles.label}>Status: {item.status}</AppText>
                                    <AppText style={styles.label}>Job Type: {item.jobType.jobType}</AppText>
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
                                </View>
                            )}
                        />
                    </View>
                </>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,

    },
    searchInput: {
        marginTop: 10,
        padding: 12,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 12,
        borderColor: '#ccc',
        fontFamily: 'Metropolis-Light',
        backgroundColor: 'white'
    },
    // listContainer: {
    //     padding: 0,
    // },
    card: {
        // backgroundColor: 'white',

        padding: 16,
        marginBottom: 12,
        borderRadius: 10,
        backgroundColor: 'white',
        borderColor: '#ccc',
        borderWidth: 1,
        elevation: 1,
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
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
});

