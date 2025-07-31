import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
    NativeAdView,
    HeadlineView,
    TaglineView,
    CallToActionView,
    IconView,
    MediaView,
} from 'react-native-admob-native-ads';

const NativeAdTest = () => {
    return (
        <NativeAdView
            adUnitID="ca-app-pub-3940256099942544/2247696110" // test unit
            style={styles.adContainer}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <IconView style={styles.icon} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <HeadlineView style={styles.headline} />
                    <TaglineView style={styles.tagline} />
                    <CallToActionView style={styles.cta} />
                </View>
            </View>
            <MediaView style={styles.media} />
        </NativeAdView>
    );
};

const styles = StyleSheet.create({
    adContainer: {
        padding: 10,
        backgroundColor: '#eee',
        borderRadius: 10,
        margin: 15,
    },
    icon: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    headline: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    tagline: {
        fontSize: 14,
    },
    cta: {
        backgroundColor: '#007bff',
        padding: 6,
        marginTop: 8,
        borderRadius: 4,
    },
    media: {
        height: 150,
        marginTop: 10,
        borderRadius: 8,
    },
});

export default NativeAdTest;
