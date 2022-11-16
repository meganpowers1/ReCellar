/**
 *
 * InstructionsScreen.js
 * Author: Megan Powers (21146284), based on the Movie App
 * instructions screen by Harjinder Singh
 *
 * 29/04/2022
 *
 * InstructionsScreen provides an overview of how the app functions for the user.
 * It is meant to be an entry point to the app, and gives information about how to navigate around.
 *
 * */

// Basic React functionality is imported to support the application
import React, {Component} from 'react';

// React Native-specific components that are used on this page are brought in
import {StyleSheet, View, Button, Text, } from 'react-native';

// InstructionsScreen is a subclass of Component, and displays
// app information to the user in a neat way.

export default class InstructionsScreen extends Component
{
    // show the page contents to the user
    render() {

        /**
         *
         * Comments for the return function are put above because of problems with
         * rendering for in-line comments.
         *
         * The UI consists of a set of instructions that informs the user
         * on how to navigate the app and make use of all of
         * its features.
         *
         */
        return (
            <View style={styles.itemStyle}>
                <Text style={styles.textStyle}>
                    Instructions:
                    {'\n'}
                    {'\n'}
                    1. On the Home Screen: Click on the Search button to search for an item by keyword.
                    {'\n'}
                    2. On the Home Screen: Click on an item in order to navigate to the item's description.
                    {'\n'}
                    3. On the Search Screen: Click on an item to navigate to the item's description.
                    {'\n'}
                    4. On the Search Screen: Press the 'Location' button to set your location information.
                    {'\n'}
                    5. On the Item Listing Screen: Press the 'Favourite' button to save an item to favourites.
                    Press either the 'Post to Twitter' or 'Post to Facebook' buttons to post the item to social media.
                    {'\n'}
                    6. On the Favourite Items Screen: If an item is pressed and held (longpressed), it can be deleted from favourites.
                    {'\n'}
                    7. On the Upload Screen: Press the 'Upload Picture' button to upload a photo with the item.
                    Press the 'Location' button to add a location to the item.
                    {'\n'}
                    8. On the Messages Screen: Enter a username and press the 'Chat' button to initiate a new chat.
                    {'\n'}
                    9. On the Account Settings Screen: Input a new username, e-mail, or password to update this
                    account information.
                    {'\n'}
                </Text>
            </View>
        );
    }
}

// Styles are defined for the UI so that the information
// is rendered clearly
const styles = StyleSheet.create
({
    itemStyle:
        {
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#e4deff',
            flexDirection: 'column',
            padding: 10,
            margin: 10,
        },
    textStyle:
        {
            fontSize: 15,
            fontStyle: 'italic',
            textAlign: 'left',
            margin: 10,
        },
    imageStyle:
        {
            width: 300,
            height: 250,
            resizeMode: 'stretch',
        },
});
