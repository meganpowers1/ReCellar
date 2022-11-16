/**
 *
 * Login.js
 * Author: Megan Powers (21146284)
 *
 * 29/04/2022
 *
 * Login is the entry point for ReCeller. It allows the user to either log in
 * using their existing credentials or to navigate to the Register screen
 * to create an account. It also uses AsyncStorage to store the logged in user's
 * credentials.
 *
 * */

// import the basic React component and library
import React, {useState} from 'react';

// import react-native specific components
import { Text, View, SafeAreaView, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';

// and AsyncStorage to store user credentials.
import AsyncStorage from '@react-native-async-storage/async-storage';


// Login
// params: navigation
// Login is a function that allows the user to log in using their existing credentials.
// It makes use of state to store the username and password that are inputted through TextInput,
// and uses fetch to send the credentials to the server to check their validity.
//

export default function Login({ navigation }) {


    // Initialize the default username and password for the user
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [isLogin, setIsLogin] = useState(true);


    // onSubmitHandler
    // This serves to send the login data in the payload to the backend.
    const onSubmitHandler = () => {

        // The payload that is posted to the backend contains the user's username and password
        // to check against credentials
        const payload = {
            username,
            password,
        };

        console.log(payload);

        // A fetch call is made to the backend with the user credentials in a payload,
        // so that it can be checked against collection values in MongoDB.
        fetch('http://192.168.1.71:5000/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
        })
            .then(async res => {
                try {
                    // Await the backend response containing information on whether the user
                    // exists and successfully logged in
                    const jsonRes = await res.json();
                    console.log(res.status);
                    // If the user succeeded...
                    if (res.status === 200) {
                        // Set the values in local storage!
                        await AsyncStorage.setItem('username', payload.username);
                        // Store user data as well for chat purposes
                        await AsyncStorage.setItem('userData', JSON.stringify(jsonRes.data[0]));


                        // Then, navigate to the HomeScreen
                        navigation.navigate('HomeScreen');


                        onLoggedIn(jsonRes.token);
                        setIsError(false);
                        setMessage(jsonRes.message);
                    } else {
                        // Otherwise, the user did not successfully log in.
                        alert("Error! Invalid credentials.");
                        setIsError(true);
                        setMessage(jsonRes.message);
                    }
                } catch (err) {
                    console.log(err);
                };
            })
            .catch(err => {
                // Output any potential errors.
                console.log(err);
            });
    };

    /**
     *
     * Comments for the return function are put above because of problems with
     * rendering for in-line comments.
     *
     * This UI displays fields where the user can input information to
     * log in. It updates setUsername and setPassword states with whatever the
     * user inputted in the TextInput
     *
     * There is also two TouchableOpacities - one for logging in, and one for
     * going to Register.js if the user needs to make an account.
     *
     */
    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.receller}>ReCeller</Text>

            <View style={{paddingBottom: 20, alignItems: 'center'}}>
                <Text style={styles.title}>Username</Text>
                <TextInput style={styles.input} onChangeText={setUsername}/>
            </View>

            <View style={{paddingBottom: 20, alignItems: 'center'}}>
                <Text style={styles.title}>Password</Text>
                <TextInput style={styles.input} secureTextEntry={true} onChangeText={setPassword}/>
            </View>

            <View style={{paddingBottom: 20, alignItems: 'center'}}>
                <TouchableOpacity style={styles.buttonStyle} onPress={onSubmitHandler}>
                    <Text style={styles.textStyle}>Login</Text>
                </TouchableOpacity>
            </View>

            <View style={{paddingBottom: 20, alignItems: 'center'}}>
                <TouchableOpacity style={styles.buttonStyle} onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.textStyle}>Register</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
}

// The styles are necessary to make sure that
// TouchableOpacity appears to the user clearly
const styles = StyleSheet.create({
    receller: {
        fontSize: 50,
        paddingTop: 50,
        paddingBottom: 50,
    },
    input: {
        borderColor: "gray",
        width: 150,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,

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
        width: 100,
        borderRadius: 50,
        paddingTop: 15,
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
    },
    title: {
        fontSize: 20,
        paddingBottom: 20,
    },
});
