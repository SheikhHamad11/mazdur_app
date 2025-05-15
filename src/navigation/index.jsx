import React, { useEffect, useState } from 'react';
import LabourStack from './LabourStack';
import { useAuth } from '../components/AuthContext';
import Loading from '../components/Loading';
import SplashScreen from '../screens/Splash';
import EmployerStack from './EmployerStack';
import EmployerDashboard from '../screens/Employer/EmployerDashboard';
import AuthStack from './AuthStack';
import { StatusBar } from 'react-native';

export default function Routes() {
  const { user, userData, loading } = useAuth();
  { console.log('user.role', userData?.role) }
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false); // hide splash after 1.5 seconds
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) (<SplashScreen />)

  if (loading) (<Loading />)



  return (
    <>
      <StatusBar
        backgroundColor="#052E5F" //rgb(240, 240, 240) Background color for Android
        barStyle="light-content" // Content style for both Android and iOS (use "dark-content" for dark text/icons)
      />
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
