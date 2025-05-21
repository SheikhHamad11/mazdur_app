// import './global.css';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Routes from './src/navigation/index';
import AuthProvider from './src/components/AuthContext';
import MobileAds from 'react-native-google-mobile-ads';


export default function App() {
useEffect(() => {
  MobileAds().initialize();
}, []);
  return (

      <AuthProvider>
        <NavigationContainer>
          <Routes />
        </NavigationContainer>
      </AuthProvider>
  
  );
}
// app id 
// ca-app-pub-5562543184619525~3169825871

// unit id 
// ca-app-pub-5562543184619525/2226385652