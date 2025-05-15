import { View, Text, Modal, Animated } from 'react-native'
import React from 'react'

export default function CommentsModal() {
    return (
        <Modal
            visible={commentModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setCommentModalVisible(false)}>
            <View style={styles.modalContainer}>
                <Animated.View
                    style={[styles.modalContent, { transform: [{ translateY: pan }] }]}
                    {...panResponder.panHandlers}>
                    {/* Display existing comments */}

                    {/* Close Button */}
                    <Pressable
                        onPress={() => setCommentModalVisible(false)}
                        style={styles.closeButton}>
                        <Text style={styles.closeText}>✕</Text>
                    </Pressable>
                    <ScrollView style={styles.commentsList}>
                        {videoComments[currentVideoId]?.length > 0 ? (
                            videoComments[currentVideoId].map((comment, index) => (
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        gap: 10,
                                        alignItems: 'center',
                                        marginVertical: 10,
                                    }}>
                                    <Image
                                        source={require('../assets/img.jpg')}
                                        style={{ height: 30, width: 30, borderRadius: 30 }}
                                    />
                                    <Text key={index} style={styles.commentText}>
                                        {comment}
                                    </Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.noCommentsText}>
                                No comments yet. Be the first to comment!
                            </Text>
                        )}
                    </ScrollView>

                    {/* Input field for adding a new comment */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.commentInput}
                            placeholder="Add a comment..."
                            placeholderTextColor="black"
                            value={currentComment}
                            onChangeText={setCurrentComment}
                            multiline
                        />

                        <Pressable
                            onPress={handleCommentSubmit}
                            style={styles.submitButton}>
                            <Text style={styles.submitText}>Submit</Text>
                        </Pressable>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    )
}