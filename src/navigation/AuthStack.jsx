import React from 'react';
import Login from '../screens/auth/Login';
import { createStackNavigator } from '@react-navigation/stack';
import Register from '../screens/auth/RegisterScreen';
import WelcomeScreen from '../screens/auth/Welcome';
import { StatusBar } from 'react-native';

export default function AuthStack() {
  const Stack = createStackNavigator();
  return (
    <>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
      </Stack.Navigator>
    </>

  );
}
