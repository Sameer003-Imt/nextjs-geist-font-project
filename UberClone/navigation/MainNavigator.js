import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import RideOptionsScreen from '../screens/RideOptionsScreen';

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Login"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#000',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Uber Clone' }}
      />
      <Stack.Screen 
        name="Map" 
        component={MapScreen}
        options={{ title: 'Select Location' }}
      />
      <Stack.Screen 
        name="RideOptions" 
        component={RideOptionsScreen}
        options={{ title: 'Choose Ride' }}
      />
    </Stack.Navigator>
  );
}
