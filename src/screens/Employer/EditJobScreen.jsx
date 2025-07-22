import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet, ToastAndroid } from 'react-native';
import { doc, getDoc, updateDoc, getFirestore } from '@react-native-firebase/firestore';
import CommonHeader from '../../components/CommonHeader';
import CommonButton from '../../components/CommonButton';
import { Picker } from '@react-native-picker/picker';
import Loading from '../../components/Loading';
import AppText from '../../components/AppText';

export default function EditJobScreen({ route, navigation }) {
    const { jobId } = route.params;
    const db = getFirestore();

    const [jobData, setJobData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const docRef = doc(db, 'jobs', jobId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setJobData(docSnap.data());
                } else {
                    console.warn('No job found');
                }
            } catch (err) {
                console.error('Error loading job:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [jobId]);

    const handleUpdate = async () => {
        if (!jobData.title || !jobData.description) return;

        try {
            setUpdating(true);
            await updateDoc(doc(db, 'jobs', jobId), jobData);
            ToastAndroid.show("Job updated", ToastAndroid.SHORT);
            navigation.goBack();
        } catch (err) {
            console.error('Update error:', err);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <Loading />

    return (
        <>
            <CommonHeader title={'Edit Job'} />
            <View style={styles.container}>
                <Text style={styles.label}>Job Title</Text>
                <TextInput
                    style={styles.input}
                    value={jobData.title}
                    onChangeText={(text) => setJobData({ ...jobData, title: text })}
                />

                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={[styles.input, { height: 100 }]}
                    multiline
                    value={jobData.description}
                    onChangeText={(text) => setJobData({ ...jobData, description: text })}
                />

                <Text style={styles.label}>Location</Text>
                <TextInput
                    style={styles.input}
                    value={jobData.location}
                    onChangeText={(text) => setJobData({ ...jobData, location: text })}
                />

                <Text style={styles.label}>Status</Text>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={jobData.status}
                        style={{ color: 'black' }}
                        onValueChange={(value) => setJobData({ ...jobData, status: value })}
                        dropdownIconColor={'black'}
                    >
                        <Picker.Item label="Active" value="active" />
                        <Picker.Item label="Closed" value="closed" />
                    </Picker>
                </View>


                {/* <Button title={updating ? 'Updating...' : 'Update Job'} onPress={handleUpdate} disabled={updating} /> */}
                <CommonButton title={updating ? <ActivityIndicator size={20} color="white" /> : 'Update Job'} onPress={handleUpdate} disabled={updating} />
            </View>
        </>

    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
        flex: 1, gap: 10
    },
    label: {

        marginTop: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 10,
        marginTop: 4,
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        marginTop: 4,
    }
});
