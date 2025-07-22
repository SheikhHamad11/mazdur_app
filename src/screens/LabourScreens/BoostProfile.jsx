import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { doc, getFirestore, serverTimestamp, setDoc, Timestamp } from '@react-native-firebase/firestore';
import { useAuth } from '../../components/AuthContext';
import CommonHeader from '../../components/CommonHeader';
import {
    RewardedAd,
    AdEventType,
    RewardedAdEventType,
    TestIds,
} from 'react-native-google-mobile-ads';
import AppText from '../../components/AppText';
const BoostProfileScreen = () => {
    const [isAdLoading, setIsAdLoading] = useState(false); // To indicate loading process
    const [isAdLoaded, setIsAdLoaded] = useState(false);
    const [isAdShowing, setIsAdShowing] = useState(false); // To prevent multiple show attempts
    const { user } = useAuth();
    const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-5562543184619525/2226385652'; // Ensure it's a rewarded ID

    // Use useRef to keep the same ad instance across re-renders
    const rewardedAdRef = useRef(null);

    const BoostProfile = async () => {
        const db = getFirestore()
        const userId = user.uid;
        await setDoc(doc(db, 'boosts', userId), {
            boostedAt: serverTimestamp(),
            expiresAt: Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000)), // 24 hours
            type: 'rewardedAd',
        });
        Alert.alert('Success', 'Profile Boosted Successfully')
    };

    // Function to initialize and load the ad
    const loadRewardedAd = () => {
        if (rewardedAdRef.current && rewardedAdRef.current.loaded) {
            console.log('Ad already loaded.');
            setIsAdLoaded(true);
            setIsAdLoading(false);
            return;
        }

        if (isAdLoading) {
            console.log('Ad is already in the process of loading.');
            return;
        }

        console.log('Creating and loading new Rewarded Ad.');
        setIsAdLoading(true);
        setIsAdLoaded(false);

        // Destroy previous instance if any, to prevent memory leaks
        // though listeners should handle this if unsubscribed properly.
        // Check library specifics if a manual destroy is needed before creating a new one.

        rewardedAdRef.current = RewardedAd.createForAdRequest(adUnitId, {
            requestNonPersonalizedAdsOnly: true,
        });

        const ad = rewardedAdRef.current;

        // Clear any previous listeners before adding new ones
        // This is important if loadRewardedAd can be called multiple times.
        // The library might offer a removeAllListeners or you might need to store and call unsubscribe.
        // For this useEffect structure, the cleanup function handles it.

        const unsubscribeLoaded = ad.addAdEventListener(
            RewardedAdEventType.LOADED,
            () => {
                console.log('Rewarded ad loaded successfully.');
                setIsAdLoaded(true);
                setIsAdLoading(false);
            }
        );

        const unsubscribeEarned = ad.addAdEventListener(
            RewardedAdEventType.EARNED_REWARD,
            (reward) => {
                console.log('User earned reward of', reward);
                BoostProfile();
                // Ad is consumed, prepare for the next one
                setIsAdLoaded(false);
                // Optionally, load the next ad automatically
                // loadRewardedAd(); // Be careful of infinite loops if load fails immediately
            }
        );

        const unsubscribeError = ad.addAdEventListener(
            AdEventType.ERROR, // Common event type for errors
            (error) => {
                console.error('Rewarded ad failed to load or an error occurred:', error);
                setIsAdLoaded(false);
                setIsAdLoading(false);
            }
        );

        const unsubscribeClosed = ad.addAdEventListener(
            AdEventType.CLOSED,
            () => {
                console.log('Rewarded ad was closed.');
                setIsAdShowing(false);
                // Ad is consumed, prepare for the next one
                setIsAdLoaded(false);
                // It's a good practice to load the next ad after the current one is closed
                // so it's ready for the next time the user wants to watch an ad.
                console.log('Ad closed, attempting to load a new one.');
                loadRewardedAd();
            }
        );
        const unsubscribeOpened = ad.addAdEventListener(
            AdEventType.OPENED,
            () => {
                console.log('Rewarded ad was opened.');
                setIsAdShowing(true);
            }
        );


        ad.load();

        // Return a cleanup function for useEffect
        return () => {
            console.log('Cleaning up ad listeners for the ad instance.');
            unsubscribeLoaded();
            unsubscribeEarned();
            unsubscribeError();
            unsubscribeClosed();
            unsubscribeOpened();
            // Consider if ad.destroy() is needed here or if listeners are enough
        };
    };


    useEffect(() => {
        console.log('useEffect: Initializing ad load process.');
        const cleanup = loadRewardedAd(); // Load the ad on initial mount

        return () => {
            if (cleanup) {
                cleanup();
            }
            // If the component is unmounted, you might want to destroy the ad instance
            // if (rewardedAdRef.current) {
            //   console.log('Component unmounting, destroying ad instance.');
            //   rewardedAdRef.current.destroy(); // Check library for actual destroy method
            //   rewardedAdRef.current = null;
            // }
        };
    }, []); // Empty dependency array: runs once on mount, cleans up on unmount




    const showAd = async () => {
        if (isAdShowing) {
            console.log('Ad is already showing or trying to show.');
            return;
        }

        console.log('Attempting to show ad...');
        console.log(`Current ad state: isAdLoaded=${isAdLoaded}, isAdLoading=${isAdLoading}`);
        console.log('rewardedAdRef.current:', rewardedAdRef.current);

        if (rewardedAdRef.current && rewardedAdRef.current.loaded && isAdLoaded) {
            console.log('Ad is loaded (instance and state agree), showing now.');
            setIsAdShowing(true); // Prevent multiple show attempts
            try {
                await rewardedAdRef.current.show();
                // setIsAdShowing will be set to false in the CLOSED event
            } catch (error) {
                console.error("Failed to show ad:", error);
                setIsAdShowing(false);
                setIsAdLoaded(false); // Ad failed to show, likely not valid anymore
                // Try to load a new ad
                console.log('Failed to show ad, attempting to load a new one.');
                loadRewardedAd();
            }
        } else {
            console.log('Ad not loaded or instance not ready.');
            if (!isAdLoading && !isAdLoaded) {
                console.log('Ad is not loading and not loaded, attempting to load now.');
                loadRewardedAd(); // Attempt to load if not already loading/loaded
                Alert.alert('Ad is loading, please try again in a moment.');
            } else if (isAdLoading) {
                Alert.alert('Ad is currently loading. Please wait.');
            } else {
                Alert.alert('The rewarded ad is not ready yet. Please try again.');
            }
        }
    };



    return (
        <>
            <CommonHeader title={'Boost Profile'} />
            <View style={styles.container}>
                {/* <AppText style={styles.header}>Boost Your Profile</AppText> */}
                <AppText style={styles.subText}>
                    Boosting increases your visibility to employers and places your profile at the top.
                </AppText>

                {/* <Image
                    source={require('../../assets/boost.png')} // Replace with your illustration
                    style={styles.illustration}
                    resizeMode="contain"
                /> */}

                <TouchableOpacity style={styles.boostButton} onPress={showAd}>
                    <Icon name="rocket" size={24} color="#fff" style={{ marginRight: 8 }} />
                    <AppText style={styles.buttonText}>Watch Ad to Boost</AppText>
                </TouchableOpacity>

                <AppText style={styles.note}>Your profile will be boosted for the next 24 hours.</AppText>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        fontSize: 24,

        textAlign: 'center',
        marginBottom: 10,
    },
    subText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    illustration: {
        width: '100%',
        height: 200,
        marginBottom: 30,
    },
    boostButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ff6b00',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,

    },
    note: {
        marginTop: 20,
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
    },
});

export default BoostProfileScreen;
