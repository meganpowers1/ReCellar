/**
 *
 * AppNavigator.js
 * Author: Megan Powers (21146284)
 *
 * 29/04/2022
 *
 * AppNavigator contains the navigation component for the entire app, which
 * takes the form of Stack navigators inside a Tab navigator inside of
 * a Stack navigator.
 *
 * */

// Import necessary navigation libraries
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icons from '@expo/vector-icons/Ionicons';


// Import all of the screens to navigate to as well as additional navigators
import Login from '../components/Login';
import Register from '../components/Register';

import UploadStackScreen from './UploadStackScreen';
import SettingsStackScreen from './SettingsStackScreen';
import SearchStackScreen from './SearchStackScreen';
import MessageStackScreen from './MessageStackScreen';
import ProfilePageScreen from './ProfilePageScreen';

// The main navigators that are used in the app
const SettingsStack = createStackNavigator();
const MainStack = createStackNavigator();
const Tab = createBottomTabNavigator();

// MainTabNavigator, which uses bottom tabs to
// present the main screens for the project. It also
// displays icons based on the tab contents
function MainTabNavigator() {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused
                            ? 'ios-information-circle'
                            : 'ios-information-circle-outline';
                    } else if (route.name === 'Search') {
                        iconName = 'search';
                    }else if (route.name === 'Upload') {
                        iconName = 'arrow-up';
                    }else if (route.name === 'Messages') {
                        iconName = 'mail';
                    }else if (route.name === 'Account') {
                        iconName = 'person';
                    }

                    // You can return any component that you like here!
                    return <Icons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#7177FF',
                tabBarInactiveTintColor: 'gray',
            })}>
            <Tab.Screen name="Home" component={SettingsStackScreen} options={{headerShown: false }} />
            <Tab.Screen name="Search" component={SearchStackScreen} options={{headerShown: false }}  />
            <Tab.Screen name="Upload" component={UploadStackScreen} options={{headerShown: false }}  />
            <Tab.Screen name="Messages" component={MessageStackScreen} options={{headerShown: false }}  />
            <Tab.Screen name="Account" component={ProfilePageScreen} options={{headerShown: false }} />
        </Tab.Navigator>
    );
}

// AppNavigator contains the main render function, which shows the
// nested navigator layout. In this case, the flow starts at the Login page,
// and goes to the HomeScreen page if the user logs in, or
// the Register page if the user registers
function AppNavigator() {
    const getTabBarIcon = (props) => {
        const {route} = props
        return <Icons name={'focused'} size={32} color={'purple'} />
    }
    return (
        <MainStack.Navigator>
            <MainStack.Screen name="Login" component={Login} options={{headerShown: false }} />
            <MainStack.Screen name="Register" component={Register} options={{headerShown: false }} />
            <MainStack.Screen name="MainApp" component={MainTabNavigator} />
            <MainStack.Screen name="HomeScreen" component={MainTabNavigator} options={{headerShown: false }} />
        </MainStack.Navigator>
    );
}

// Export the navigator for use elsewhere
export default AppNavigator;
