// import './global.css';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Routes from './src/navigation/index';
import AuthProvider from './src/components/AuthContext';
import MobileAds from 'react-native-google-mobile-ads';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


export default function App() {

useEffect(() => {
  MobileAds()
    .initialize()
    .then(() => {
      console.log('AdMob initialized');
    });
}, []);

  return (
    <>
      <SafeAreaView style={{ flex: 1  }}>
        <GestureHandlerRootView>
             <AuthProvider>
               <NavigationContainer>
                 <Routes />
               </NavigationContainer>
             </AuthProvider>
             </GestureHandlerRootView>
      </SafeAreaView>
    </>
  );
}
// app id 
// ca-app-pub-5562543184619525~3169825871

// unit id 
// ca-app-pub-5562543184619525/2226385652

// useEffect(() => {
//   MobileAds()
//     .setRequestConfiguration({
//       testDeviceIdentifiers: ['BFE632AADC23A5F6E5778E0BB6D749B3'], // 👈 your device ID
//     })
//     .then(() => {
//       MobileAds()
//         .initialize()
//         .then(statuses => {
//           console.log('AdMob initialized:', statuses);
//         })
//         .catch(err => {
//           console.log('Initialization error:', err);
//         });
//     });
// }, []);