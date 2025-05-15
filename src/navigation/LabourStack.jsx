import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LabourDashboard from '../screens/LabourScreens/LabourDashboard';
// import Icon from 'react-native-vector-icons/Ionicons';
import Settings from '../screens/LabourScreens/Settings';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import SplashScreen from '../screens/Splash';
import SkillUploadScreen from '../screens/LabourScreens/SkillUpload';
import Icon from 'react-native-vector-icons/Ionicons';
import JobRequestsScreen from '../screens/LabourScreens/JobRequests';
import MazdoorTVScreen from '../screens/LabourScreens/MazdoorTV';
import EditProfile from '../screens/LabourScreens/EditProfile';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
export default function LabourStack() {
  const LabourTabs = () => {
    return (
      <>
        {/* <StatusBar
          backgroundColor="#052E5F" //rgb(240, 240, 240) Background color for Android
          barStyle="light-content" // Content style for both Android and iOS (use "dark-content" for dark text/icons)
        /> */}
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
              else if (route.name === 'MazdoorTV') {
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
              // height: 70,
              paddingBottom: 10,

            },
            headerShown: false,
            tabBarHideOnKeyboard: true,
          })}
        >
          <Tab.Screen name="LabourDashboard" component={LabourDashboard} />
          <Tab.Screen name="MazdoorTV" component={MazdoorTVScreen} />
          <Tab.Screen name="JobRequest" component={JobRequestsScreen} />
          <Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator>
      </>
    );
  };
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, initialRouteName: 'Splash' }}>
      <Stack.Screen name="LabourTabs" component={LabourTabs} />
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="SkillUpload" component={SkillUploadScreen} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
    </Stack.Navigator>
  );
}
