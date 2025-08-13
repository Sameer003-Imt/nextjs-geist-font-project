import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import MainNavigator from './navigation/MainNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <MainNavigator />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
