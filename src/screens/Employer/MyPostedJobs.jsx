import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert, Pressable, ToastAndroid, TouchableOpacity, ScrollView } from 'react-native';
import firestore, { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, orderBy, query, updateDoc, where } from '@react-native-firebase/firestore';
import { useAuth } from '../../components/AuthContext'; // Adjust if your path is different
import CommonHeader from '../../components/CommonHeader';
import auth, { getAuth } from '@react-native-firebase/auth';
import Loading from '../../components/Loading';
import AppText from '../../components/AppText';
import MyButton from '../../components/MyButton';
export default function MyPostedJobsScreen({ navigation }) {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingapp, setLoadingapp] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedJobApplicants, setSelectedJobApplicants] = useState([]);
  const [visibleApplicantsMap, setVisibleApplicantsMap] = useState({});
  const [applicantsData, setApplicantsData] = useState({});

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchApplicants = async (jobId) => {
    const db = getFirestore();
    try {
      setLoadingapp(true);

      const q = query(
        collection(db, 'applications'),
        where('jobId', '==', jobId)
      );
      const snapshot = await getDocs(q);

      const applicants = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const application = docSnap.data();
          const userDoc = await getDoc(doc(db, 'users', application.labourId));
          const userData = userDoc.exists() ? userDoc.data() : {};

          return {
            id: docSnap.id,
            ...application,
            labourName: userData.name || 'Unknown User',
          };
        })
      );

      // Store applicants for this jobId
      setApplicantsData(prev => ({ ...prev, [jobId]: applicants }));

      // Toggle visibility
      setVisibleApplicantsMap(prev => ({
        ...prev,
        [jobId]: !prev[jobId],
      }));
      setLoadingapp(false);
    } catch (error) {
      console.error('Error fetching applicants:', error);
    } finally {
      setLoadingapp(false);
    }
  };


  const approveApplicant = async (jobId, labourId) => {
    console.log('jobId,labourId', jobId, labourId)
    const db = getFirestore();
    try {
      // Approve this applicant
      await updateDoc(doc(db, 'applications', jobId), {
        status: 'approved',
      });

      // Optionally reject others
      // const jobApplicationsQuery = query(
      //   collection(db, 'applications'),
      //   where('jobId', '==', jobId)
      // );
      // const allApps = await getDocs(jobApplicationsQuery);
      // allApps.forEach((docSnap) => {
      //   if (docSnap.id !== jobId) {
      //     updateDoc(doc(db, 'applications', docSnap.id), {
      //       status: 'rejected',
      //     });
      //   }
      // });

      // // Optionally store approved user in jobs collection
      // await updateDoc(doc(db, 'jobs', jobId), {
      //   approvedApplicantId: labourId,
      // });
      Alert.alert('Approved')
      fetchApplicants(jobId); // Refresh list
    } catch (error) {
      console.error('Error approving applicant:', error);
    }
  };


  const fetchJobs = async () => {
    try {
      const auth = getAuth();
      const db = getFirestore();
      const user = auth.currentUser;

      const jobsRef = collection(db, 'jobs');
      const jobsQuery = query(
        jobsRef,
        where('employerId', '==', user.uid),
        orderBy('postedAt', 'desc')
      );

      const snapshot = await getDocs(jobsQuery);
      const jobData = await Promise.all(snapshot.docs.map(async doc => {
        const applicantsSnapshot = await getDocs(
          query(collection(db, 'applications'), where('jobId', '==', doc.id))
        );
        return {
          id: doc.id,
          applicantCount: applicantsSnapshot.size,
          ...doc.data(),
        };
      }));

      setJobs(jobData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (jobId) => {
    navigation.navigate('EditJobScreen', { jobId });
  };

  const handleDelete = async (jobId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this job?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete", style: "destructive", onPress: async () => {
            try {
              await deleteDoc(doc(getFirestore(), 'jobs', jobId));
              setJobs(prev => prev.filter(job => job.id !== jobId));
              ToastAndroid.show("Job deleted", ToastAndroid.SHORT);
            } catch (err) {
              console.error("Delete error:", err);
            }
          }
        }
      ]
    );
  };


  const onRefresh = async () => {
    setRefreshing(true);
    await fetchJobs(); // reuse your existing fetch logic
    setRefreshing(false);
  };


  return (
    <>
      <CommonHeader title={'Jobs Posted'} />
      {loading ? <Loading /> :
        <FlatList onRefresh={onRefresh} refreshing={refreshing} nestedScrollEnabled={true}
          data={jobs}
          // ListHeaderComponent={<CommonHeader title={'JobsPosted'} />}
          ListEmptyComponent={<AppText style={{ padding: 16 }}>No jobs posted.</AppText>}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <AppText style={styles.title} font='medium'>Job Title: {item?.title}</AppText>
              <AppText>Job Type: {item?.jobType?.jobType}</AppText>
              <AppText style={styles.label}>Location: {item?.location}</AppText>
              <AppText style={styles.label}>Salary: {item?.salary}</AppText>
              <AppText style={styles.label}>Date: {item?.postedAt.toDate().toLocaleString()}</AppText>
              <AppText style={styles.status}>Status: {item?.status}</AppText>
              <AppText style={styles.label}>Applicants: {item?.applicantCount}</AppText>
              <MyButton
                style={{ marginTop: 10 }}
                onPress={() => fetchApplicants(item?.id)}
                title={'View Applicants'}
              />


              {visibleApplicantsMap[item?.id] && (
                <ScrollView nestedScrollEnabled={true} style={{ padding: 16, backgroundColor: '#fff', marginTop: 10 }}>
                  <AppText style={{ fontSize: 16, marginBottom: 10 }}>Applicants:</AppText>
                  {(applicantsData[item?.id] || []).map(app => (
                    <View key={app.id} style={{ marginBottom: 12, borderBottomWidth: 1, paddingBottom: 8 }}>
                      <AppText>Name: {app.labourName}</AppText>
                      {/* {console.log('app', app)} */}
                      <AppText>Status: {app.labourId}</AppText>
                      {item.status === 'active' && (
                        <TouchableOpacity
                          style={[styles.button, { backgroundColor: 'skyblue', marginTop: 6, padding: 6 }]}
                          onPress={() => approveApplicant(app.id, app.labourId)}
                        >
                          <AppText style={styles.buttonText}>Approve</AppText>
                        </TouchableOpacity>
                      )}
                    </View >
                  ))
                  }
                </ScrollView >
              )
              }


              <View style={styles.actions}>
                <Pressable onPress={() => handleEdit(item.id)} style={styles.editBtn}>
                  <AppText style={styles.actionText}>Edit</AppText>
                </Pressable>

                <Pressable onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                  <AppText style={styles.actionText}>Delete</AppText>
                </Pressable>
              </View>
            </View >
          )
          }
        />
      }

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

  },
  label: {
    marginTop: 4,
    color: '#333',
  },
  status: {
    marginTop: 6,
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

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editBtn: {
    backgroundColor: '#4CAF50',
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  deleteBtn: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
  },
  actionText: {
    color: '#fff',

  },

});
