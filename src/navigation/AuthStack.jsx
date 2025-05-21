import React from 'react';
import Login from '../screens/auth/Login';
import { createStackNavigator } from '@react-navigation/stack';
import Register from '../screens/auth/RegisterScreen';
import WelcomeScreen from '../screens/auth/Welcome';
import LabourDashboard from '../screens/LabourScreens/LabourDashboard';
import EmployerDashboard from '../screens/Employer/EmployerDashboard';


export default function AuthStack() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="LabourDashboard" component={LabourDashboard} />
      <Stack.Screen name="EmployerDashboard" component={EmployerDashboard} />
      {/* <Stack.Screen name="ForgetPassword" component={ForgetPassword} /> */}
    </Stack.Navigator>
  );
}
