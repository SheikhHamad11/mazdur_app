import React from 'react'
// import { createStackNavigator } from '@react-navigation/stack';
import EmployerDashboard from '../screens/Employer/EmployerDashboard';
import Icon from 'react-native-vector-icons/Ionicons';
import MyPostedJobsScreen from '../screens/Employer/MyPostedJobs';
import LaborSearchScreen from '../screens/Employer/LabourSearch';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LaborerSettings from '../screens/LabourScreens/Settings';
import { StatusBar } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PostJobScreen from '../screens/Employer/PostJob';
import MazdoorTV from '../screens/LabourScreens/MazdoorTV';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const EmployerTabs = () => {
    return (
        <>
            {/* <StatusBar
                backgroundColor="#052E5F" //rgb(240, 240, 240) Background color for Android
                barStyle="light-content" // Content style for both Android and iOS (use "dark-content" for dark text/icons)
            /> */}
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
                        else if (route.name === 'MazdoorTV') {
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
        </>
    );
};
export default function EmployerStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="EmployerTabs" component={EmployerTabs} />
            <Stack.Screen name="PostJob" component={PostJobScreen} options={{ title: 'Post a Job' }} />
            <Tab.Screen name="MazdoorTV" component={MazdoorTV} />
        </Stack.Navigator>
    );
}
