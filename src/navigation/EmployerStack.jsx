import React from 'react'
import EmployerDashboard from '../screens/Employer/EmployerDashboard';
import Icon from 'react-native-vector-icons/Ionicons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LaborerSettings from '../screens/LabourScreens/Settings';
import MyPostedJobsScreen from '../screens/Employer/MyPostedJobs';
import LaborSearchScreen from '../screens/Employer/LabourSearch';
import PostJobScreen from '../screens/Employer/PostJob';
import MazdoorTV from '../screens/LabourScreens/MazdurTV';
import EditProfile from '../screens/LabourScreens/EditProfile';
import EditJobScreen from '../screens/Employer/EditJobScreen';
import NotificationsScreen from '../screens/LabourScreens/Notifications';
import LabourProfileScreen from '../screens/LabourScreens/LabourProfile';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function EmployerStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="EmployerTabs" component={EmployerTabs} />
            <Stack.Screen name="PostJob" component={PostJobScreen} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="LabourProfile" component={LabourProfileScreen} />
            <Stack.Screen name="EditJobScreen" component={EditJobScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="MazdurTV" component={MazdoorTV} />
        </Stack.Navigator>
    );
}

const EmployerTabs = () => {
    return (
        <Tab.Navigator
            initialRouteName="Dashboard"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Dashboard') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Labour Search') {
                        iconName = focused ? 'person' : 'person-outline';

                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    }
                    else if (route.name === 'MazdurTV') {
                        iconName = focused ? 'tv' : 'tv-outline';
                    }
                    else if (route.name === 'Jobs Posted') {
                        iconName = focused ? 'briefcase' : 'briefcase-outline';
                    }

                    // You can return any component that you like here!
                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#052E5F',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    backgroundColor: 'white',
                },
                tabBarLabelStyle: {
                    fontFamily: 'Metropolis-Medium',
                },
                headerShown: false,
                tabBarHideOnKeyboard: true,
            })}
        >
            <Tab.Screen name="Dashboard" component={EmployerDashboard} />
            <Tab.Screen name="Jobs Posted" component={MyPostedJobsScreen} />
            <Tab.Screen name="Labour Search" component={LaborSearchScreen} />
            <Tab.Screen name="Settings" component={LaborerSettings} />
        </Tab.Navigator>

    );
};