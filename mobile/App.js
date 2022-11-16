/**
 *
 * App.js
 * Author: Megan Powers (21146284)
 *
 * 29/04/2022
 *
 * App.js is the entry point for the entire ReCeller app, and
 * contains the main navigation components.
 *
 * */
// Import React Native components
import React, {Component} from 'react';
import { Button, Text, View, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

// Import the app navigator for navigation reasons
import AppNavigator from './navigation/AppNavigator';
import {GestureHandlerRootView} from "react-native-gesture-handler";

// This holds the main, top-level stack navigator which is imported from AppNavigator
export default class App extends React.Component
{
  render()
  {

    // the 'NavigationContainer' component is used to hold the (tab) navigator component
    // ... which creates components for each of the screens and nested navigator
    return(
        <GestureHandlerRootView style={{ flex: 1 }}>{
          <SafeAreaView style = {{flex:1}}>

            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>

          </SafeAreaView>
        }</GestureHandlerRootView>
    );
  }
}

