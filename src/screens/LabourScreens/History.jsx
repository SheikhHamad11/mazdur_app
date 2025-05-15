import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../components/AuthContext'; // adjust if needed
import Loading from '../components/Loading';

export default function HireHistoryScreen() {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchHireHistory = async () => {
        try {
            const snapshot = await firestore()
                .collection('hires')
                .where('labourId', '==', user.uid)
                .orderBy('date', 'desc')
                .get();

            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setHistory(data);
        } catch (err) {
            console.log('Error fetching hire history:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchHireHistory();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchHireHistory();
    };

    if (loading) {
        return (
            <Loading />
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Hire History</Text>
            {history.length === 0 ? (
                <Text style={styles.noData}>No hire history found.</Text>
            ) : (
                <FlatList
                    data={history}
                    keyExtractor={(item) => item.id}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.jobTitle}>{item.jobTitle}</Text>
                            <Text>Status: {item.status}</Text>
                            <Text>Payment: Rs. {item.payment}</Text>
                            <Text>Date: {new Date(item.date).toDateString()}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
    noData: { fontSize: 16, color: 'gray' },
    card: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    jobTitle: { fontSize: 18, fontWeight: 'bold' },
});
