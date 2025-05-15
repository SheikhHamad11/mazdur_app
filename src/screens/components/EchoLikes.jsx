import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function EchoLike({ userId }) {
    const [likeCount, setLikeCount] = useState(0);
    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     const fetchLikes = async () => {
    //         try {
    //             const snapshot = await firestore()
    //                 .collection('videos')
    //                 .where('uid', '==', userId)
    //                 .get();

    //             let totalLikes = 0;
    //             snapshot.forEach(doc => {
    //                 totalLikes += doc.data().likes || 0;
    //             });

    //             setLikeCount(totalLikes);
    //         } catch (error) {
    //             console.error('Error fetching likes:', error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchLikes();
    // }, [userId]);

    if (loading) {
        return <ActivityIndicator size="small" color="#000" />;
    }

    return (
        <View style={{ padding: 10 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                Echo Likes: {likeCount}
            </Text>
        </View>
    );
}
