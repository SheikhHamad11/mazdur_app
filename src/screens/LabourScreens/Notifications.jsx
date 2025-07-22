// NotificationsScreen.js
import React, { use } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import CommonHeader from '../../components/CommonHeader';
import { useAuth } from '../../components/AuthContext';
import AppText from '../../components/AppText';



const labourNotifications = [
    {
        id: '1',
        title: 'Job Request',
        message: 'You received a new job request from Ahmed.',
        time: '2 min ago',
        icon: require('../../assets/labour-day.png'),
    },
    {
        id: '2',
        title: 'Reminder',
        message: 'Upload more skill videos to increase visibility.',
        time: '15 min ago',
        icon: require('../../assets/img.jpg'),
    },
    {
        id: '3',
        title: 'Tip',
        message: 'Update your skills section for better matching.',
        time: '1 hour ago',
        icon: require('../../assets/logo.png'),
    },
];

const employerNotifications = [
    {
        id: '1',
        title: 'Application Received',
        message: 'Ali has applied for your job request.',
        time: '5 min ago',
        icon: require('../../assets/logo.png'),
    },
    {
        id: '2',
        title: 'Recommendation',
        message: 'We found new labours matching your criteria.',
        time: '25 min ago',
        icon: require('../../assets/logo.png'),
    },
    {
        id: '3',
        title: 'Reminder',
        message: 'Don’t forget to review applications.',
        time: '1 hour ago',
        icon: require('../../assets/logo.png'),
    },
];



export default function NotificationsScreen() {
    const { userData } = useAuth();
    const notifications = userData?.role === 'employer'
        ? employerNotifications
        : labourNotifications;
    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Image source={item.icon} style={styles.icon} />
            <View style={styles.content}>
                <AppText style={styles.title} font='medium'>{item.title}</AppText>
                <AppText style={styles.message}>{item.message}</AppText>
                <AppText style={styles.time}>{item.time}</AppText>
            </View>
        </View>
    );

    return (
        <>
            <CommonHeader title={'Notifications'} />
            <View style={styles.container}>

                <FlatList
                    data={notifications}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 15, backgroundColor: '#f9f9f9' },
    header: { fontSize: 22, marginBottom: 15 },
    card: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        elevation: 3,
        alignItems: 'center',
    },
    icon: { width: 40, height: 40, marginRight: 15 },
    content: { flex: 1 },
    title: { fontSize: 16, fontWeight: '600' },
    message: { fontSize: 14, color: '#555', marginVertical: 2 },
    time: { fontSize: 12, color: '#999' },
});


    // const handleLike = async () => {
    //     try {
    //         const likeRef = doc(db, 'users', item.labourId, 'likes', user.uid);
    //         if (liked) {
    //             await deleteDoc(likeRef);
    //             setLiked(false);
    //             setLikesCount(prev => Math.max(prev - 1, 0));
    //         } else {
    //             await setDoc(likeRef, { liked: true });
    //             setLiked(true);
    //             setLikesCount(prev => prev + 1);
    //         }
    //     } catch (error) {
    //         console.error('Error toggling like:', error);
    //     }
    // };

         // const fetchLikeStatus = async () => {
            //     try {
            //         const likeRef = doc(db, 'users', item.labourId, 'likes', user.uid);
            //         const likeSnap = await getDoc(likeRef);
            //         if (likeSnap.exists()) {
            //             setLiked(true);
            //         }
    
            //         const likeCollection = collection(db, 'users', item.labourId, 'likes');
            //         const allLikes = await getDocs(likeCollection);
            //         setLikesCount(allLikes.size);
            //     } catch (error) {
            //         console.error('Error fetching like status:', error);
            //     }
            // };