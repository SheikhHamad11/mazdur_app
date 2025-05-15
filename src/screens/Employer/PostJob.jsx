import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    ScrollView,
    Alert,
    StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CommonButton from '../../components/CommonButton';
import CommonHeader from '../../components/CommonHeader';

export default function PostJobScreen({ navigation }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [salary, setSalary] = useState('');
    const [jobType, setJobType] = useState('');
    const [workersNeeded, setWorkersNeeded] = useState('');

    const handlePostJob = async () => {
        if (!title || !description || !location || !salary) {
            Alert.alert('Missing Fields', 'Please fill out all required fields.');
            return;
        }

        try {
            const user = auth().currentUser;
            await firestore().collection('jobs').add({
                title,
                description,
                location,
                salary,
                jobType,
                workersNeeded,
                employerId: user.uid,
                postedAt: firestore.FieldValue.serverTimestamp(),
            });

            Alert.alert('Success', 'Job posted successfully!');
            navigation.goBack();
        } catch (error) {
            console.error('Error posting job:', error);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        }
    };

    return (
        <>
            <CommonHeader title={'Post a Job'} />
            <ScrollView contentContainerStyle={styles.container}>

                {/* <Text style={styles.heading}>Post a Job</Text> */}

                <TextInput
                    style={styles.input}
                    placeholder="Job Title"
                    placeholderTextColor="#888"
                    value={title}
                    onChangeText={setTitle}
                />

                <TextInput
                    style={[styles.input, { height: 100 }]}
                    placeholder="Job Description"
                    placeholderTextColor="#888"
                    multiline
                    value={description}
                    onChangeText={setDescription}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Location"
                    placeholderTextColor="#888"
                    value={location}
                    onChangeText={setLocation}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Salary (e.g. 1500/month)"
                    placeholderTextColor="#888"
                    value={salary}
                    onChangeText={setSalary}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Job Type (Full-time / Part-time)"
                    placeholderTextColor="#888"
                    value={jobType}
                    onChangeText={setJobType}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Workers Needed"
                    placeholderTextColor="#888"
                    value={workersNeeded}
                    onChangeText={setWorkersNeeded}
                    keyboardType="numeric"
                />

                {/* <View style={styles.buttonContainer}>
                <Button title="Post Job" onPress={handlePostJob} />
            </View> */}
                <CommonButton title={'Post Job'} onPress={handlePostJob} />
            </ScrollView>
        </>

    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40,
        backgroundColor: '#fff',
        flex: 1
    },
    heading: {
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
        marginBottom: 20,
        fontSize: 16,
        color: '#000',
    },
    buttonContainer: {
        marginTop: 20,
    },
});
