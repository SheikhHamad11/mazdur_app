import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import CommonHeader from '../../components/CommonHeader';
import { useAuth } from '../../components/AuthContext';

export default function LaborSearchScreen({ navigation }) {
    const { user } = useAuth()
    const [query, setQuery] = useState('');
    const [laborers, setLaborers] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLaborers = async () => {
            try {
                const snapshot = await firestore().collection('users').where('role', '==', 'labour').get();
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setLaborers(data);
                {
                    console.log({ data });
                }
                setFiltered(data);
            } catch (err) {
                console.log('Error fetching laborers:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchLaborers();
    }, []);

    const handleSearch = (text) => {
        setQuery(text);
        const filteredResults = laborers.filter((item) =>
            item.name?.toLowerCase().includes(text.toLowerCase()) ||
            item.skills?.includes(text.toLowerCase())
        );
        setFiltered(filteredResults);

    };
    const sendJobRequest = async (labour) => {
        try {
            await firestore().collection('jobs').add({

                employerName: user.name,
                labourId: labour.id,
                skill: labour.skill,
                employerId: user.uid,
                status: 'pending',
                date: firestore.FieldValue.serverTimestamp(),
            });

            alert('Job request sent!');
        } catch (err) {
            console.error('Error sending job request:', err);
        }
    };


    if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

    return (
        <>
            <CommonHeader title={'LabourSearch'} />
            <View style={styles.container}>

                <TextInput
                    placeholder="Search by skill or name"
                    placeholderTextColor={'gray'}
                    value={query}
                    onChangeText={handleSearch}
                    style={styles.searchInput}
                />

                {filtered.length === 0 ? (
                    <Text style={styles.noResult}>No matching laborers found.</Text>
                ) : (
                    <FlatList
                        data={filtered}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => renderLaborer({ item, sendJobRequest })}
                        contentContainerStyle={{ paddingBottom: 20 }}

                    />
                )}
            </View>
        </>
    );
}

const renderLaborer = ({ item, navigation, sendJobRequest }) => (

    <View style={styles.card}>
        <Text style={styles.name}>Name:{item.name}</Text>
        <Text>Skills: {item?.skills}</Text>
        <Text>Status: {item?.available ? 'Available' : 'Unavailable'}</Text>
        <TouchableOpacity
            style={styles.button}
            onPress={() => sendJobRequest(item)}
        >
            <Text style={styles.buttonText}>Send Job Request</Text>
        </TouchableOpacity>
    </View>
);
const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    searchInput: {
        padding: 12,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 12,
        borderColor: '#ccc',
    },
    card: {
        padding: 16,
        backgroundColor: '#eee',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 10,
    },
    name: { fontSize: 18, fontWeight: 'bold' },
    button: {
        marginTop: 10,
        backgroundColor: '#007bff',
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
});
