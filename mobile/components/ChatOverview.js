
/**
 *
 * ChatOverview.js
 * Author: Megan Powers (21146284)
 * 29/04/2022
 *
 * ChatOverview is an intermediary screen between the general application layout and specific chats.
 * It allows the current, signed-in user to specify a user that they want to chat with,
 * and navigates to that chat when the user is ready.
 *
 * */

// Basic React functionality is imported to support the application
import React, {Component, useEffect, useState} from 'react';

// React Native-specific components that are used on this page are brought in
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
} from 'react-native';


/**
 *
 * ChatOverview
 * params: navigation
 *
 * ChatOverview is a function that allows the user to specify a user that they
 * want to message and chat with them by pressing a button. It uses state
 * to track which user the current user wants to chat with, as well as
 * passing information about the user to chat with to the chat screen.
 *
 */
const ChatOverview = ({navigation}) => {

    // Set initial state for the user the signed-in user wants to chat with
    const [user, setUsername] = useState("N/A");

    /**
     *
     * Comments for the return function are put above because of problems with
     * rendering for in-line comments.
     *
     * ScrollView is used to ensure that the website features won't disappear
     * off the screen.
     *
     * The user has a text field that changes based on what username they enter,
     * using state to change the user constant.
     *
     * When the user is ready, they can press the TouchableOpacity button
     * to navigate to the chat screen.
     *
     */
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}> Input username to chat</Text>
            <TextInput style={styles.input} onChangeText={setUsername}/>

            <TouchableOpacity style={styles.buttonStyle}
                              onPress={() => navigation.navigate(
                                  'ChatScreen',
                                { passedItem: user }
                    )}>
                <Text style={styles.textStyle}>Chat</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

// Styles provides styles for the above screen.
// In this case, the TouchableOpacity and input field need to be styled to
// ensure that the user can see them clearly on the screen.

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center'
    },
    input: {
        borderColor: "gray",
        width: 300,
        borderWidth: 1,
        borderRadius: 10,
        marginLeft: 10,
        marginRight: 10,
        padding: 10,
    },
    dropdownmenu: {
        width: "100%",
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginRight: 100,
        backgroundColor: "#dfdddf"
    },
    header:{
        fontSize: 20,
        textAlign: 'justify',
        margin: 5,

    },
    buttonStyle:{
        borderRadius: 50,
        margin: 15,
        width: 150,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "powderblue",
    },
    textStyle:{
        fontSize: 25,
        textAlign: 'justify',
        margin: 5,

    }
});

// Export the function for use in other places.
export default ChatOverview;
