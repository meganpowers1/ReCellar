/**
 *
 * SearchFilterScreen.js
 * Author: Megan Powers (21146284), based on an algorithm by
 * Snehal Agrawal:
 * https://aboutreact.com/react-native-geolocation/
 *
 * 29/04/2022
 *
 * SearchFilterScreen is a component that supports React Native Geolocation.
 * This enables the code to get the user's current position and utilize
 * AsyncStorage to save the current logged-in user's geolocation coordinates.
 *
 * */


// import the basic React component and library
import React, {useState, useEffect} from 'react';

// import react-native specific components
import {
    Platform,
    Image,
    PermissionsAndroid,
    Button,
    Text,
    View,
    SafeAreaView,
    StyleSheet,
    FlatList,
    TouchableOpacity
} from 'react-native';

// As the geolocation coordinates need to be saved locally, AsyncStorage is imported
import AsyncStorage from '@react-native-async-storage/async-storage';

// Geolocation needs to be declared so the user can save their coordinates.
import Geolocation from '@react-native-community/geolocation';

// SearchFilterScreen
// This constant contains functionality for the current location status to be
// gotten by requesting location permission. This is then saved using state
// and put in AsyncStorage for further use.
const SearchFilterScreen = () => {

    // Initialize the state variables for latitude and longitude
    const [currentLongitude, setCurrentLongitude] = useState('...');
    const [currentLatitude, setCurrentLatitude] = useState('...');
    const [
        locationStatus,
        setLocationStatus
    ] = useState('');

    // useEffect is a hook that runs every time the components render
    // This is used to request location permission from the user and
    // get the location depending on what platform the user is on.
    useEffect(() => {
        const requestLocationPermission = async () => {
            // Check whether the user is an ios user or an android user
            if (Platform.OS === 'ios') {
                // The location can be gotten right away if the phone runs on ios
                getOneTimeLocation();
                subscribeLocationLocation();
            } else {
                try {
                    // If the user is on android, then extra permissions must be set
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        {
                            title: 'Location Access Required',
                            message: 'This App needs to Access your location',
                        },
                    );
                    // If the permissions are granted, run the get location
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        getOneTimeLocation();
                        subscribeLocationLocation();
                    } else {
                        // Otherwise, permission is denied
                        setLocationStatus('Permission Denied');
                    }
                } catch (err) {
                    //If there is an error, print
                    console.warn(err);
                }
            }
        };
        // Request the location permission from the user
        requestLocationPermission();
    }, []);

    // getOneTimeLocation
    // This function gets the location from the user only once.
    // It uses React Geolocation to do this, and sets the
    // current latitude and longitude in AsyncStorage.
    const getOneTimeLocation = () => {
        // Set the location status state to getting the location
        // until the position is gotten.
        setLocationStatus('Getting Location ...');

        // Use Geolocation to request the current position
        Geolocation.getCurrentPosition(

            // On success, the current position is stored in the response
            async (position) => {
                setLocationStatus('You are Here');

                // Store the current Longitude from the location JSON
                const currentLongitude =
                    JSON.stringify(position.coords.longitude);
                // Store the current Latitude from the location JSON
                const currentLatitude =
                    JSON.stringify(position.coords.latitude);
                // Set the longitude state
                setCurrentLongitude(currentLongitude);
                // Set the user's longitude in AsyncStorage for later fetching
                await AsyncStorage.setItem('userLongitude', currentLongitude);
                // Set the state for current latitude
                setCurrentLatitude(currentLatitude);
                // Set the user's longitude in AsyncStorage for later fetching
                await AsyncStorage.setItem('userLatitude', currentLatitude);
            },
            (error) => {
                // Inform the user if the location wasn't stored
                console.log(error);
                setLocationStatus(error.message);
            },
            {
                // Options for how accurate the location settings are
                enableHighAccuracy: false,
                timeout: 30000,
                maximumAge: 1000
            },
        );
    };

    // subscribeLocationLocation
    // This function continuously requests the current user position.
    // watchID refers to the user giving their continuous permission for settings.
    const subscribeLocationLocation = () => {
        var watchID = Geolocation.watchPosition(
            // Store coordinates upon success
            (position) => {

                // When the user's location changes, set their status to
                // something entirely different.
                setLocationStatus('You are Here');
                console.log(position);

                // Store the Longitude from the location JSON
                const currentLongitude =
                    JSON.stringify(position.coords.longitude);

                // Store Latitude from the location JSON
                const currentLatitude =
                    JSON.stringify(position.coords.latitude);

                // Set the state for the current longitude value
                setCurrentLongitude(currentLongitude);

                // Update the longitude value in AsyncStorage
                AsyncStorage.setItem('userLongitude', currentLongitude);

                // Set the state for the current latitude value
                setCurrentLatitude(currentLatitude);

                // Update the latitude value in AsyncStorage
                AsyncStorage.setItem('userLatitude', currentLatitude);

            },
            // Tell the user about any potential errors
            (error) => {
                setLocationStatus(error.message);
            },
            // Set options for the accuracy of the location
            {
                enableHighAccuracy: false,
                maximumAge: 1000
            },
        );
    };

    /**
     *
     * Comments for the return function are put above because of problems with
     * rendering for in-line comments.
     *
     * This UI only returns a button that the user clicks on
     * to get their current location with the onPress.
     *
     */
    return (
        <SafeAreaView style={{flex: 1}}>

            <View style={{ }}>
                <TouchableOpacity style={styles.buttonStyle} onPress={getOneTimeLocation}>
                    <Text style={styles.textStyle}>Enable Location</Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textStyle: {
        fontSize: 15,
        fontFamily: 'Times New Roman',
        color: 255,
    },
    buttonStyle: {
        width: 200,
        borderRadius: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'powderblue',
    },
    boldText: {
        fontSize: 25,
        color: 'red',
        marginVertical: 16,
    },
});

export default SearchFilterScreen;
