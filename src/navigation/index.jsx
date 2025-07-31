import React, { useEffect, useState } from 'react';
import LabourStack from './LabourStack';
import { useAuth } from '../components/AuthContext';
import Loading from '../components/Loading';
import SplashScreen from '../screens/Splash';
import EmployerStack from './EmployerStack';
import AuthStack from './AuthStack';
import { StatusBar } from 'react-native';
import { AppOpenAd, AdEventType, TestIds, MobileAds } from 'react-native-google-mobile-ads';

const appOpenAd = AppOpenAd.createForAdRequest(
  __DEV__ ? TestIds.APP_OPEN : 'ca-app-pub-5562543184619525/8919016973',
  {
    requestNonPersonalizedAdsOnly: true,
  }
);

export default function Routes() {
  const { user, userData, loading } = useAuth();

  const [initializing, setInitializing] = useState(true);
  const [splashDone, setSplashDone] = useState(false);
  const [adDone, setAdDone] = useState(false);

  // Show splash for fixed time
  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setSplashDone(true);
    }, 2000); // 2 seconds
    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    const initAd = async () => {
      await MobileAds().initialize();

      appOpenAd.load();

      appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
        appOpenAd.show();
      });

      appOpenAd.addAdEventListener(AdEventType.CLOSED, () => {
        setAdDone(true);
      });

      appOpenAd.addAdEventListener(AdEventType.ERROR, () => {
        setAdDone(true);
      });
    };

    initAd();

    return () => {
      appOpenAd.removeAllListeners();
    };
  }, []);

  const readyToShowApp = splashDone && adDone;

  if (!readyToShowApp || loading) {
    return <SplashScreen />;
  }

  return (
    <>
      <StatusBar backgroundColor={'#052E5F'} barStyle={'light-content'} />
      {!userData ? (
        <AuthStack />
      ) : userData?.role === 'labour' ? (
        <LabourStack />
      ) : userData?.role === 'employer' ? (
        <EmployerStack />
      ) : null}
    </>
  );
}
