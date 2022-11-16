/**
 *
 * MessagesStackScreen.js
 * Author: Megan Powers (21146284)
 *
 * 29/04/2022
 *
 * MessagesStackScreen represents the nested stack navigator in the
 * Messages stack, which can navigate between the ChatOverview,
 * ChatScreen, Register, and Home components
 *
 * */

// Import the navigator from React Navigation
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icons from '@expo/vector-icons/Ionicons';

// Import the screen components
import HomeScreen from '../components/HomeScreen';
import ChatOverview from '../components/ChatOverview';
import ChatScreen from '../components/ChatScreen';
import Register from '../components/Register';

// Create a stack navigator for the screen
const SettingsStack = createStackNavigator();

// Export the navigator for use elsewhere
export default function MessageStackScreen() {
    return (
        <SettingsStack.Navigator>
            <SettingsStack.Screen name="ChatOverview" component={ChatOverview} />
            <SettingsStack.Screen name="ChatScreen" component={ChatScreen} />
            <SettingsStack.Screen name="Register" component={Register} />
            <SettingsStack.Screen name="Home" component={HomeScreen} />
        </SettingsStack.Navigator>
    );
}
