import React, { useState } from 'react';
import {
    TextInput,
    ScrollView,
    Alert,
    StyleSheet,
    View,
    ActivityIndicator,
} from 'react-native';
import CommonHeader from '../../components/CommonHeader';
import { getFirestore, collection, addDoc, serverTimestamp } from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../../components/AuthContext';
import MyButton from '../../components/MyButton';
import AppText from '../../components/AppText';

export default function PostJobScreen({ navigation }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [salary, setSalary] = useState('');
    const [jobType, setJobType] = useState('');
    const [workersNeeded, setWorkersNeeded] = useState('');
    const [loading, setLoading] = useState(false);
    const { userData } = useAuth()
    const handlePostJob = async () => {
        if (!title || !description || !location || !salary) {
            Alert.alert('Missing Fields', 'Please fill out all required fields.');
            return;
        }
        try {
            setLoading(true)
            const auth = getAuth();
            const db = getFirestore();
            const user = auth.currentUser;

            await addDoc(collection(db, 'jobs'), {
                title,
                description,
                location,
                salary,
                jobType,
                workersNeeded,
                employerId: user.uid,
                employerName: userData?.name,
                status: 'active',
                postedAt: serverTimestamp(),
            });

            Alert.alert('Success', 'Job posted successfully!');
            setLoading(false)
            navigation.goBack();
        } catch (error) {
            setLoading(false)
            console.error('Error posting job:', error);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        }
    };

    return (
        <>
            <CommonHeader title={'Post a Job'} />
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps={'always'}>

                {/* <Text style={styles.heading}>Post a Job</Text> */}
                {/* <Text style={styles.label}>Location</Text> */}
                <AppText font='medium' >
                    Job Title </AppText>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Job Title"
                    placeholderTextColor="#888"
                    value={title}
                    onChangeText={setTitle}
                />
                <AppText font='medium' >
                    Job Description </AppText>
                <TextInput
                    style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                    placeholder="Enter Job Description"
                    placeholderTextColor="#888"
                    multiline

                    value={description}
                    onChangeText={setDescription}
                />
                <AppText font='medium' >
                    Job Location</AppText>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Location"
                    placeholderTextColor="#888"
                    value={location}
                    onChangeText={setLocation}
                />
                <AppText font='medium' >
                    Salary </AppText>
                <TextInput
                    style={styles.input}
                    placeholder="Salary (e.g. 1500/month)"
                    placeholderTextColor="#888"
                    value={salary}
                    onChangeText={setSalary}
                />
                <AppText font='medium' >
                    Job Type </AppText>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={jobType}

                        style={{ color: 'black', }}
                        onValueChange={(value) => setJobType({ jobType: value })}
                        dropdownIconRippleColor={'black'}
                        dropdownIconColor={'black'}
                    >
                        <Picker.Item label="Select Job Type" value="" />
                        <Picker.Item label="Full-Time" value="Full-Time" />
                        <Picker.Item label="Part-Time" value="Part-Time" />
                    </Picker>
                </View>
                <AppText font='medium' >
                    Workers Needed </AppText>
                <TextInput
                    style={styles.input}
                    placeholder="Workers Needed"
                    placeholderTextColor="#888"
                    value={workersNeeded}
                    onChangeText={setWorkersNeeded}
                    keyboardType="numeric"
                />

                <MyButton title={loading ? <ActivityIndicator color={'white'} size={20} /> : 'Post Job'} onPress={handlePostJob} style={{ marginTop: 10 }} />
            </ScrollView>
        </>

    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        // paddingBottom: 40,
        // backgroundColor: '#fff',
        // flex: 1
    },
    heading: {
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderRadius: 6,
        borderBottomColor: '#ccc',
        padding: 10,
        marginVertical: 10,
        fontSize: 16,
        color: '#000',
        fontFamily: 'Metropolis-Light',
    },
    buttonContainer: {
        marginTop: 20,
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        marginVertical: 8,
    }
});
