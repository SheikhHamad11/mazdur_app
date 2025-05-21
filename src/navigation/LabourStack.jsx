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
import MazdoorTV from '../screens/LabourScreens/MazdurTV';
import ExploreNewJobs from '../screens/LabourScreens/ExploreNewJobs';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
export default function LabourStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, initialRouteName: 'Splash' }}>
      <Stack.Screen name="LabourTabs" component={LabourTabs} />
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="SkillUpload" component={SkillUploadScreen} />
      <Stack.Screen name="ExploreNewJobs" component={ExploreNewJobs} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
    </Stack.Navigator>
  );
}

const LabourTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="LabourDashboard"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'LabourDashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'person' : 'person-outline';

          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          else if (route.name === 'MazdurTV') {
            iconName = focused ? 'tv' : 'tv-outline';
          }
          else if (route.name === 'JobRequest') {
            iconName = focused ? 'briefcase' : 'briefcase-outline';
          }
          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#052E5F',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'white',
          paddingBottom: 10,
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen name="LabourDashboard" component={LabourDashboard} />
      <Tab.Screen name="MazdurTV" component={MazdoorTV} />
      <Tab.Screen name="JobRequest" component={JobRequestsScreen} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>

  );
};
