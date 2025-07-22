// components/CommentsModal.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, getFirestore } from '@react-native-firebase/firestore';
// import Modal from 'react-native-modal';

const db = getFirestore();

const CommentsModal = ({ visible, onClose, videoId, user }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        if (!videoId || !visible) return;

        const q = query(
            collection(db, 'videos', videoId, 'comments'),
            orderBy('timestamp', 'desc')
        );

        const unsubscribe = onSnapshot(q, snapshot => {
            setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => unsubscribe();
    }, [videoId, visible]);

    const postComment = async () => {
        if (newComment.trim().length === 0) return;

        await addDoc(collection(db, 'videos', videoId, 'comments'), {
            comment: newComment,
            userId: user.uid,
            username: user.name || 'User',
            timestamp: serverTimestamp(),
        });

        setNewComment('');
    };

    return (
        <Modal visible={visible} onDismiss={onClose} style={{ margin: 0, justifyContent: 'flex-end' }}>
            <View style={styles.container}>
                <FlatList
                    data={comments}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.commentBox}>
                            <Text style={styles.username}>{item.username}</Text>
                            <Text>{item.comment}</Text>
                        </View>
                    )}
                />
                <View style={styles.inputRow}>
                    <TextInput
                        value={newComment}
                        onChangeText={setNewComment}
                        placeholder="Add a comment..."
                        style={styles.input}
                    />
                    <Button title="Send" onPress={postComment} />
                </View>
            </View>
        </Modal>
    );
};

export default CommentsModal;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 10,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        maxHeight: '70%',
    },
    commentBox: {
        marginVertical: 5,
    },
    username: {
        fontWeight: 'bold',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        marginRight: 10,
        padding: 8,
        borderRadius: 6,
        borderColor: '#ccc',
    },
});
