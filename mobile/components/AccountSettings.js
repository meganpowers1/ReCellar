/**
 *
 * AccountSettings.js
 * Author: Megan Powers (21146284)
 *
 * 29/04/2022
 *
 * AccountSettings is a page that allows the user to change
 * information associated with their account. It contains
 * fields for the user to input a new username, email, or password,
 * which are taken from the route props. Then, fetch JSON functions are
 * used to send the data to the database.
 *
 * */

// import the basic React component and library
import React, {Component, useState} from 'react';

// import react-native specific components
import { Button, Text, View, SafeAreaView, ScrollView, StyleSheet, FlatList, TouchableOpacity, TextInput, Picker, Platform  } from 'react-native';

// Import AsyncStorage to save settings
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = 'http://10.0.2.2:5000';

// AccountSettings is a class that contains functionality for
// changing the user account details. It is a subclass
// of Component and can make a call to the Component props and
// constructor in order to take in the current user's details
// in order to set them locally, as well

export default class AccountSettings extends Component
{

    // a constructor sets a basic state for the page, based off of the
    // component supertype's functionality
    constructor(props)
    {
        // the Component supertype has a basic constructor that is called
        super(props);

        // state contains information that changes based on what's happening in the
        // current screen. In this case, it contains the list of items that were
        // favourited and whether an item is still being fetched from storage
        this.state = {
            itemList: [],
            itemID: '',
            email: "",
            username: "",
            password: "",
            passedUser: "",
            isLoading: true,
        };
    }

    // updateUsername
    // This function takes in the passed-in user information and
    // makes a fetch API call to the backend to update that
    // information.

    updateUsername = () => {

        const {passedUser} = this.state;
        var currUsername = passedUser['username'];
        var {username} = this.state;

        // Create the new object for the user text fields
        const payload = {
            currUsername,
            username,
        };


        // Send fetch call to the server so that the data can be checked against
        // values in the database and inserted
        fetch('http://192.168.1.71:5000/updateUsername', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            // Store payload in a string format
            body: JSON.stringify(payload),
        })
            .then(async res => {
                try {
                    // Wait for the status to update and return
                    const jsonRes = await res.json();
                    console.log(res.status);
                    if (res.status !== 200) {
                        // If the status was not successful, the user was not created.
                        setIsError(true);
                        alert("Username not changed.");
                        setMessage(jsonRes.message);
                    } else {
                        // If the user succeeded...
                        console.log("res:");
                        console.log(jsonRes);
                        console.log(jsonRes.data);

                        // Set the values in local storage!
                        await AsyncStorage.setItem('username', jsonRes.data);

                        // Update user data as well for chat purposes
                        var a = await AsyncStorage.getItem('userData');

                        a = JSON.parse(a);
                        a["username"] = jsonRes.data;

                        console.log("a:")
                        console.log(a);
                        this.setState({username: jsonRes.data});

                        await AsyncStorage.setItem('userData', JSON.stringify(a));

                        var a = await AsyncStorage.getItem('userData');

                        a = JSON.parse(a);

                        this.setState({passedUser: a});

                        console.log("passedUser:");
                        console.log(passedUser);
                        alert("Username changed.");
                        console.log("correct");
                        setIsError(false);
                        setMessage(jsonRes.message);
                    }
                } catch (err) {
                    // Inform the user of any errors.
                    console.log(err);
                };
            })
            .catch(err => {
                console.log(err);
            });
    };

    // updatePassword
    // This function takes in password information and
    // sends it to the server using a fetch API call.
    updatePassword = () => {

        const {passedUser} = this.state;
        var currUserVal = passedUser['username'];

        const {password} = this.state;

        // Create the new object for the user text fields
        const payload = {
            currUserVal,
            password
        };

        console.log(payload);

        // Send fetch call to the server so that the data can be checked against
        // values in the database and inserted
        fetch('http://192.168.1.71:5000/updatePassword', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            // Store payload in a string format
            body: JSON.stringify(payload),
        })
            .then(async res => {
                try {
                    // Wait for the status to update and return
                    const jsonRes = await res.json();
                    console.log(res.status);
                    if (res.status !== 200) {
                        // If the status was not successful, the user was not created.
                        setIsError(true);
                        alert("Password not changed.");
                        setMessage(jsonRes.message);
                    } else {
                        // Store user data
                        var passReturn = jsonRes.data;
                        var a = await AsyncStorage.getItem('userData');

                        a = JSON.parse(a);
                        a["password"] = passReturn;

                        await AsyncStorage.setItem('userData', JSON.stringify(a));

                        var a = await AsyncStorage.getItem('userData');

                        a = JSON.parse(a);

                        this.setState({passedUser: a});
                        console.log("aaa");
                        console.log(passReturn)

                        var a = await AsyncStorage.getItem('userData');
                        console.log(a);
                        a = JSON.parse(a);

                        this.setState({passedUser: a});
                        alert("Password changed.");
                        console.log("correct");
                        setIsError(false);
                        setMessage(jsonRes.message);
                    }
                } catch (err) {
                    // Inform the user of any errors.
                    console.log(err);
                };
            })
            .catch(err => {
                console.log(err);
            });
    };

    // updateEmail
    // this function takes in the user's new email
    // and sends a Fetch API call to the backend to update this value
    updateEmail = () => {

        const {passedUser} = this.state;
        var currUser = passedUser['username'];


        const {email} = this.state;

        // Create the new object for the user text fields
        const payload = {
            currUser,
            email
        };


        // Send fetch call to the server so that the data can be checked against
        // values in the database and inserted
        fetch('http://192.168.1.71:5000/updateEmail', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            // Store payload in a string format
            body: JSON.stringify(payload),
        })
            .then(async res => {
                try {
                    // Wait for the status to update and return
                    const jsonRes = await res.json();
                    console.log(res.status);
                    if (res.status !== 200) {
                        // If the status was not successful, the email was not updated.
                        setIsError(true);
                        alert("Email not changed.");
                        setMessage(jsonRes.message);
                    } else {
                        var passEmail = jsonRes.data;
                        var a = await AsyncStorage.getItem('userData');

                        a = JSON.parse(a);
                        a["email"] = passEmail;

                        await AsyncStorage.setItem('userData', JSON.stringify(a));

                        var a = await AsyncStorage.getItem('userData');

                        a = JSON.parse(a);

                        this.setState({passedUser: a});

                        var a = await AsyncStorage.getItem('userData');
                        console.log(a);
                        a = JSON.parse(a);

                        this.setState({passedUser: a});
                        alert("Email changed!");
                        console.log("correct");
                        setIsError(false);
                        setMessage(jsonRes.message);
                    }
                } catch (err) {
                    // Inform the user of any errors.
                    console.log(err);
                };
            })
            .catch(err => {
                console.log(err);
            });
    };

    async componentDidMount()
    {
        // Check whether the properties contain valid values
        if (this.props.route.params) {

            // Store the current item that was passed in before saving it
            const {passedUser} = this.props.route.params;
            this.setState({passedUser: this.props.route.params["passedItem"]["userDetails"]});

        }

    }

    /**
     *
     * Comments for the return function are put above because of problems with
     * rendering for in-line comments.
     *
     * This UI displays text fields for the user to input values for the
     * username, e-mail, and password that can be used to register.
     *
     * The user can then submit their information. If successful,
     * the function for inserting the information, onSubmitHandler, is called.
     * Using the navigation prop, the program travels to the Login page.
     *
     */
    render(){

        // Initialize variables for the default text fields and potential errors,
        // as well as whether the user successfully registered.

        const {email} = this.state;
        const {username} = this.state;
        const {password} = this.state;

        var {passedUser} = this.state;


        return (
            <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
                <ScrollView>

                <View style={{paddingBottom: 20, paddingTop: 20, alignItems: 'center'}}>
                    <Text style={styles.title}>Username</Text>
                    <TextInput style={styles.input} onChangeText={value=>{this.setState({username:value})}}/>

                </View>

                <TouchableOpacity style={styles.buttonStyle} onPress={this.updateUsername}>
                    <Text style={styles.textStyle}>Update Username</Text>
                </TouchableOpacity>

                <View style={{paddingBottom: 20, paddingTop:20, alignItems: 'center'}}>
                    <Text style={styles.title}>Email</Text>
                    <TextInput style={styles.input} onChangeText={value=>{this.setState({email:value})}}/>
                </View>

                <TouchableOpacity style={styles.buttonStyle} onPress={this.updateEmail}>
                    <Text style={styles.textStyle}>Update E-mail</Text>
                </TouchableOpacity>

                <View style={{paddingBottom: 20, paddingTop: 20, alignItems: 'center'}}>
                    <Text style={styles.title}>Password</Text>
                    <TextInput style={styles.input} secureTextEntry={true} onChangeText={value=>{this.setState({password:value})}} />
                </View>

                <TouchableOpacity style={styles.buttonStyle} onPress={this.updatePassword}>
                    <Text style={styles.textStyle}>Update Password</Text>
                </TouchableOpacity>

                <View style={{paddingBottom: 20, alignItems: 'center'}}>

                </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

// The style focuses on making the three text input fields
// look presentable to the user, and ensuring TouchableOpacity shows.
const styles = StyleSheet.create({
    receller: {
        fontSize: 50,
        paddingTop: 50,
        paddingBottom: 50,
    },
    text: {
        fontSize: 15,
        paddingRight: 20,
        paddingLeft: 20,
        paddingBottom: 10,
    },
    input: {
        borderColor: "gray",
        width: "100%",
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,

    },
    dropdownmenu: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginRight: 100,
        backgroundColor: '#EFEFEF'
    },
    title: {
        fontSize: 20,
        paddingBottom: 20,
    },
    containerStyle: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textStyle: {
        fontSize: 15,
        fontFamily: 'Times New Roman',
        color: 255,
    },
    buttonStyle: {
        width: 150,
        paddingTop: 15,
        borderRadius: 50,
        height: 50,
        alignItems: 'center',
        backgroundColor: 'powderblue',
    },
    imageStyle: {
        resizeMode: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
        width: 300,
        height: 300,
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    }
});
