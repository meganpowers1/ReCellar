/**
 *
 * ProfilePage.js
 * Author: Megan Powers (21146284), based on the Movie App
 * by Harjinder Singh
 *
 * 29/04/2022
 *
 * ProfilePage represents the profile information of the current logged-in
 * user. It relies on AsyncStorage to retreieve the user details, which
 * it then displays using flex in order to align all values properly.
 * It also contains a button to navigate to a page where the user can
 * change their individual account's information.
 *
 * */

// import the basic React component and library
import React, {Component} from 'react';

// import react-native specific components
import {ActivityIndicator, StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';

// get data locally for now

// and AsyncStorage to store user credentials.
import AsyncStorage from '@react-native-async-storage/async-storage';


// ProfilePage
// this class extends Component, and has access to
// the superclass's constructor and props. this contains the
// user's profile data that is fetched from the backend

export default class ProfilePage extends Component
{

    // The supertype Component constructor is used for setting up default information
    constructor(props)
    {
        // the supertype constructor is created
        super(props);

        // Details about values that change with state are initialized
        // in the constructor
        this.state = {
            // details of the (single) selected item
            userDetails: {"username": "temp"},
            // default image uri to prevent errors
            imageURI: '',
            isLoading: true,
            searchTerm: '',
            // default tweet and post content initialized
            tweetContent: 'Check out this item!',
            postContent: 'Check out this item!',
            facebookShareURL: 'https://receller.com/',
            twitterShareURL: 'https://receller.com/',

        };

    }

    // componentDidMount
    // This function is used to display information to the user when
    // a certain item is rendered/mounted - in this case, the ListItem that the
    // user navigated from.

    async componentDidMount()
    {
        // the item ID passed in from the previous screen that the user clicked on is
        // stored in the params, so it can be saved in passedItemID

        var passedUser = await AsyncStorage.getItem('userData');

        this.setState({userDetails: JSON.parse(passedUser)});

    }
    // https://stackoverflow.com/questions/66136800/geocoding-issue-in-react-native-geocoding

    // render displays the UI to the user and stores default variables that can be updated
    // by the state.
    render() {
        const {navigate} = this.props.navigation;
        const {twitterShareURL, tweetContent, facebookShareURL, postContent} = this.state;
        var userDetails = this.state['userDetails'];

        console.log(userDetails);

        /**
         *
         * Comments for the return function are put above because of problems with
         * rendering for in-line comments.
         *
         * This UI displays the information fetched from the database. The image URI
         * is also gotten from the database and displayed to the user. Of note is that
         * the image is stored locally as a URI because images are difficult to store
         * directly in mongoDB.
         *
         * The Favourite button allows the user to favourite an item and save it
         * locally on the device.
         *
         * The social media buttons allow the user to share information about the listing
         * on social media.
         *
         */
        return (
            <View style={styles.containerStyle}>

                <View style={styles.textBackground}>
                    <Text style={styles.headerStyle}>Username * {userDetails.username}</Text>
                </View>

                <View style={styles.textBackground}>
                    <Text style={styles.headerStyle}>Email * {userDetails.email}</Text>
                </View>

                <View style={styles.textBackground}>
                    <Text style={styles.headerStyle}>User ID * {userDetails.userid}</Text>
                </View>

                <View style={styles.textBackground}>
                    <Text style={styles.headerStyle}>Balance * £0.00</Text>
                </View>

                <TouchableOpacity style={styles.buttonStyle}  onPress={() => this.props.navigation.navigate(
                    'AccountSettings',
                    { passedItem: this.state}
                )}>
                    <Text style={styles.textStyle}>Settings</Text>
                </TouchableOpacity>

            </View>
        );
    }
}

// Styles are defined for the UI so that the information
// is rendered clearly
const styles = StyleSheet.create
({
    containerStyle:
        {
            flex: 1,
            margin: 15,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f5f4f5',
        },
    itemStyle:
        {
            backgroundColor: '#f5f4f5',
            padding: 10,
            margin: 10,
        },
    buttonStyle:{
        width: 150,
        borderRadius: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'powderblue',
    },
    textBackground:{
        width: 350,
        borderRadius: 20,
        marginBottom: 10,
        flex: 1,
        justifyContent: 'center',
        backgroundColor: "#E5E5E5",
    },
    textStyle:
        {
            fontSize: 20,

            textAlign: 'justify',
            margin: 10,
        },
    titleStyle:
        {
            fontSize: 20,
            textAlign: 'justify',
            margin: 5,
        },
    headerStyle:
        {
            fontSize: 25,
            paddingLeft: 10,
            paddingRight: 10,
            textAlign: 'justify',
            margin: 5,
        },
    categoryStyle:
        {
            fontSize: 20,
            backgroundColor: "#dfdddf",
            textAlign: 'justify',
        },
    informationStyle:
        {
            fontSize: 15,
            textAlign: 'justify',
            margin: 5,
        },
    imageStyle:
        {
            width: 300,
            height: 250,
            resizeMode: 'contain',
            flexWrap: 'wrap',
        },
});

