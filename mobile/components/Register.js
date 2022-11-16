/**
 *
 * Register.js
 * Author: Megan Powers (21146284), referenced from an algorithm by
 * Agustin Fernandez,
 * https://www.asapdevelopers.com/build-a-react-native-login-app-with-node-js-backend/
 *
 * 29/04/2022
 *
 * Register is the page that allows the user to make an account based on
 * values sent to the backend using the fetch call. The values are then
 * stored if the user was created in the DB, or not otherwise.
 * The user is then brought back to the Login.
 *
 * */

// import the basic React component and library
import React, {Component, useState} from 'react';

// import react-native specific components
import { Button, Text, View, SafeAreaView, ScrollView, StyleSheet, FlatList, TouchableOpacity, TextInput, Picker, Platform  } from 'react-native';

// Import Login so it can be navigated to
import Login from './Login';


const API_URL = 'http://10.0.2.2:5000';

// Register
// params: navigation
// Register is a function that allows for user data to be set from
// text fields. It is then sent to the server, which creates a
// new user if one is not already there. State is used to change
// the values for the text fields.

export default function Register({ navigation }) {

    // Initialize variables for the default text fields and potential errors,
    // as well as whether the user successfully registered.

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const onChangeHandler = () => {
        setIsLogin(!isLogin);
        setMessage('');
    };

    // onLoggedIn
    // Once logged in, generate a token for the user session
    // that is fetched from the server.
    const onLoggedIn = token => {
        fetch(`${API_URL}/private`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(async res => {
                try {
                    const jsonRes = await res.json();
                    if (res.status === 200) {
                        setMessage(jsonRes.message);
                    }
                } catch (err) {
                    console.log(err);
                };
            })
            .catch(err => {
                console.log(err);
            });
    }

    // onSubmitHandler
    // This is a function that creates a data structure
    // for the user input values, and posts it to the
    // server in order to insert it into the database.

    const onSubmitHandler = () => {

        // Create the new object for the user text fields
        const payload = {
            email,
            username,
            password,
        };

        // Send fetch call to the server so that the data can be checked against
        // values in the database and inserted
        fetch('http://192.168.1.71:5000/register', {
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
                    console.log(res);
                    if (res.status !== 200) {
                        // If the status was not successful, the user was not created.
                        alert("Error! Invalid credentials.")
                        setIsError(true);
                        setMessage(jsonRes.message);
                    } else {
                        // Otherwise, the user was created. The navigation prop then moves to the Login page.
                        alert("Account successfully created.");
                        navigation.navigate('Login');
                        setIsError(false);
                        setMessage(jsonRes.message);
                    }
                } catch (err) {
                    // Inform the user of any errors.
                    alert("Account was unable to be created.");
                    console.log(err);
                };
            })
            .catch(err => {
                console.log(err);
            });
    };

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
    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.receller}>ReCeller</Text>
            <ScrollView>
            <View style={{paddingBottom: 20, alignItems: 'center'}}>
                <Text style={styles.title}>Username</Text>
                <TextInput style={styles.input} onChangeText={setUsername}/>
            </View>

            <View style={{paddingBottom: 20, alignItems: 'center'}}>
                <Text style={styles.title}>Email</Text>
                <TextInput style={styles.input} onChangeText={setEmail}/>
            </View>

            <View style={{paddingBottom: 20, alignItems: 'center'}}>
                <Text style={styles.title}>Password</Text>
                <TextInput style={styles.input} secureTextEntry={true} onChangeText={setPassword} />
            </View>

            <View style={{paddingBottom: 20, alignItems: 'center'}}>


            </View>

            <View style={{paddingBottom: 20, alignItems: 'center'}}>
                <Text style={styles.text}>By registering, I confirm that I have accepted ReCeller's Terms and Conditions, and that I am at least 18.</Text>
                <TouchableOpacity style={styles.buttonStyle} onPress={onSubmitHandler}>
                    <Text style={styles.textStyle}>Sign Up</Text>
                </TouchableOpacity>
            </View>

            <View style={{paddingBottom: 20, alignItems: 'center'}}>
                <TouchableOpacity style={styles.buttonStyle} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.textStyle}>Login</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
        </SafeAreaView>
    );
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
        width: 150,
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
        borderRadius: 50,
        alignItems: 'center',
        paddingTop: 15,
        height: 50,
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
