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
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function EmployerStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="EmployerTabs" component={EmployerTabs} />
            <Stack.Screen name="PostJob" component={PostJobScreen} options={{ title: 'Post a Job' }} />
            <Tab.Screen name="EditProfile" component={EditProfile} />
            <Tab.Screen name="MazdurTV" component={MazdoorTV} />
        </Stack.Navigator>
    );
}

const EmployerTabs = () => {
    return (
        <Tab.Navigator
            initialRouteName="EmployerDashboard"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'EmployerDashboard') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'LabourSearch') {
                        iconName = focused ? 'person' : 'person-outline';

                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    }
                    else if (route.name === 'MazdurTV') {
                        iconName = focused ? 'tv' : 'tv-outline';
                    }
                    else if (route.name === 'JobsPosted') {
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
            <Tab.Screen name="EmployerDashboard" component={EmployerDashboard} />
            <Tab.Screen name="JobsPosted" component={MyPostedJobsScreen} />
            <Tab.Screen name="LabourSearch" component={LaborSearchScreen} />
            <Tab.Screen name="Settings" component={LaborerSettings} />
        </Tab.Navigator>

    );
};