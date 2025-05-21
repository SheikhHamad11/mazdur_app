import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Image } from 'react-native';
import firestore, { addDoc, onSnapshot, serverTimestamp } from '@react-native-firebase/firestore';
import CommonHeader from '../../components/CommonHeader';
import { useAuth } from '../../components/AuthContext';
import { getFirestore, collection, query, where, getDocs } from '@react-native-firebase/firestore';
import Loading from '../../components/Loading';
export default function LaborSearchScreen({ navigation }) {
    const { user } = useAuth()
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
                employerId: user.uid,
                status: 'pending',
                date: serverTimestamp(),
            });
            // Mark this labourId as requested
            setSentRequests(prev => ({ ...prev, [labourId]: true }));


            alert('Job request sent!');
        } catch (err) {
            console.error('Error sending job request:', err);
        }
    };


    if (loading) return <Loading />;

    return (
        <>
            <CommonHeader title={'LabourSearch'} />
            <View style={styles.container}>

                <TextInput
                    placeholder="Search by skill or name"
                    placeholderTextColor={'gray'}
                    value={queiry}
                    onChangeText={handleSearch}
                    style={styles.searchInput}
                />

                {filtered.length === 0 ? (
                    <Text style={styles.noResult}>No matching laborers found.</Text>
                ) : (
                    <FlatList
                        data={filtered}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => renderLaborer({ item, sendJobRequest, sentRequests })}
                        contentContainerStyle={{ paddingBottom: 20 }}

                    />
                )}
            </View>
        </>
    );
}

const renderLaborer = ({ item, navigation, sendJobRequest, sentRequests }) => (

    <View style={styles.card}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
            <>
                {item?.photoURL ? (
                    <Image source={{ uri: item?.photoURL }} style={styles.image} />
                ) : (
                    <Image source={require('../../assets/placeholder.png')} style={styles.image} />
                )}
            </>
            <View>
                <Text style={styles.name}>Labour Name:{item.name}</Text>
                <Text>Email: {item?.email}</Text>
                <Text>Skills: {item?.skills}</Text>

                <Text>Status: {item?.available ? 'Available' : 'Unavailable'}</Text>
            </View>
        </View>

        <TouchableOpacity
            style={[styles.button, { backgroundColor: sentRequests[item.id] === 'pending' ? '#007bff' : 'gray' }]}
            onPress={() => sendJobRequest(item.id)}
            disabled={sentRequests[item.id] === 'pending' || sentRequests[item.id] === 'accepted'} // ✅ explicit boolean
        >
            <Text style={styles.buttonText}> {sentRequests[item.id] === 'accepted' ? 'Accepted' : sentRequests[item.id] === 'pending' ? 'Requested' : 'Send Request'}</Text>
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
