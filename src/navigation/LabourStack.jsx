import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LabourDashboard from '../screens/LabourScreens/LabourDashboard';
import Settings from '../screens/LabourScreens/Settings';
import SplashScreen from '../screens/Splash';
import SkillUploadScreen from '../screens/LabourScreens/SkillUpload';
import Icon from 'react-native-vector-icons/Ionicons';
import JobRequestsScreen from '../screens/LabourScreens/JobRequests';
import EditProfile from '../screens/LabourScreens/EditProfile';
import MazdurTV from '../screens/LabourScreens/MazdurTV';
import ExploreNewJobs from '../screens/LabourScreens/ExploreNewJobs';
import BoostProfileScreen from '../screens/LabourScreens/BoostProfile';
import NotificationsScreen from '../screens/LabourScreens/Notifications';
import { StatusBar } from 'react-native';
import LabourProfileScreen from '../screens/LabourScreens/LabourProfile';
import About from '../screens/LabourScreens/About';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
export default function LabourStack() {
  return (
    <>
      <Stack.Navigator
        screenOptions={{ headerShown: false, initialRouteName: 'Splash' }}>
        <Stack.Screen name="LabourTabs" component={LabourTabs} />
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="MazdurTV" component={MazdurTV} />
        <Stack.Screen name="About" component={About} />
        <Stack.Screen name="LabourProfile" component={LabourProfileScreen} />
        <Stack.Screen name="SkillUpload" component={SkillUploadScreen} />
        <Stack.Screen name="ExploreNewJobs" component={ExploreNewJobs} />
        <Stack.Screen name="BoostProfile" component={BoostProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
      </Stack.Navigator>
    </>

  );
}

const LabourTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'New Jobs') {
            iconName = focused ? 'briefcase' : 'briefcase-outline';

          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          else if (route.name === 'MazdurTV') {
            iconName = focused ? 'tv' : 'tv-outline';
          }
          else if (route.name === 'Job Requests') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          }
          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#052E5F',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          marginBottom: 5,
          fontFamily: 'Metropolis-Medium',
        },

        headerShown: false,
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen name="Home" component={LabourDashboard} />
      <Tab.Screen name="New Jobs" component={ExploreNewJobs} />
      <Tab.Screen name="Job Requests" component={JobRequestsScreen} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>

  );
};
