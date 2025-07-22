import { View, StyleSheet, Text } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import AppText from './AppText';
export default function CommonHeader({ title, isBack = true }) {
    const navigation = useNavigation();
    // console.log(title);

    return (
        <View style={styles.header}>
            {/* Left Section (Back Icon) */}
            <View style={styles.side}>
                {isBack && (
                    <Icon
                        name='chevron-left'
                        size={35}
                        color='white'
                        onPress={() => navigation.goBack()}
                    />
                )}
            </View>

            {/* Center Section (Title) */}
            <View style={styles.center}>
                <AppText
                    children={title}
                    style={{ textAlign: 'center', fontSize: 22, color: 'white', fontWeight: '500' }}
                />
            </View>

            {/* Right Section (Empty for symmetry) */}
            <View style={styles.side} />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#052E5F',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 18,
    },
    side: {
        width: 40, // fixed width for icon and symmetry
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
