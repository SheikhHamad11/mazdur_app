import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../components/AuthContext'; // Adjust if your path is different
import CommonHeader from '../../components/CommonHeader';
import auth from '@react-native-firebase/auth';
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
      const user = auth().currentUser;
      const snapshot = await firestore()
        .collection('jobs')
        .where('employerId', '==', user.uid)
        .orderBy('postedAt', 'desc')
        .get();

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

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchJobs(); // reuse your existing fetch logic
    setRefreshing(false);
  };


  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  // if (jobs.length === 0) {
  //   return (
  //     <View style={styles.emptyContainer}>
  //       <Text style={styles.emptyText}>No jobs posted yet.</Text>
  //     </View>
  //   );
  // }

  return (
    <>

      <FlatList onRefresh={onRefresh} refreshing={refreshing}
        data={jobs}
        ListHeaderComponent={<View style={{ padding: 0, margin: 0 }}><CommonHeader title={'JobsPosted'} /></View>}
        ListEmptyComponent={<Text style={{ padding: 16 }}>No jobs posted.</Text>}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>Job Title:{item.title}</Text>
            <Text>Job Description:{item.description}</Text>
            <Text style={styles.label}>Location: {item.location}</Text>
            <Text style={styles.label}>Date: {item.date}</Text>
            <Text style={styles.status}>Status: {item.status}</Text>
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
  },
});
