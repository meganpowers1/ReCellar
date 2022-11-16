/**
 *
 * InstructionsScreen.js
 * Author: Megan Powers (21146284)
 *
 * 29/04/2022
 *
 * ListingInformation contains functionality for displaying information about a listing
 * to the user. It contains details about individual items that a user can navigate to,
 * and provides the capability for a user to favourite an item.
 *
 * */

// Basic React functionality is imported to support the application
import React, {Component} from 'react';

// React Native-specific components that are used on this page are brought in
import {StyleSheet, View, Linking, Text, ScrollView, TouchableOpacity, Image} from 'react-native';

// ListingInformation is a child class of Component, and contains
// a constructor that allows the page to set up default properties/states.
// It contains detailed information about items to present to a user.
export default class ListingInformation extends Component
{

    // The supertype Component constructor is used for setting up default information
    constructor(props)
    {
        // the supertype constructor is created
        super(props);

        // Details about values that change with state are initialized
        // in the constructor
        this.state = {
            // details of the individual selected item
            listingDetails: {
                "photoData" : {
                    "_parts": [
                        "photo",
                        {
                            "name" : "",
                            "type" : "",
                            "uri" : ""
                        }
                    ]
                }
            },
            imageURI: '://',
            isLoading: true,
            searchTerm: '',
            tweetContent: 'Check out this item!',
            itemLocation: "",
            postContent: 'Check out this item!',
            facebookShareURL: 'https://receller.com/',
            twitterShareURL: 'https://receller.com/',

        };

    }

    // componentDidMount
    // This function is used to display information to the user when
    // a certain item is rendered/mounted - in this case, the ListItem that the
    // user navigated from.

    componentDidMount()
    {
        // the item ID passed in from the previous screen that the user clicked on is
        // stored in the params, so it can be saved in passedItemID
        const {passedItemID} = this.props.route.params;

        // This ID can be used to fetch the corresponding item from the backend
        this.getItemDetails(passedItemID);
        console.log(this.itemLocation());
    }

    // getItemDetails
    // @params itemID
    // getItemDetails has an itemID passed in, which is then
    // sent to the backend using a GET fetch call.
    // the relevant item data is then gotten back from the db
    getItemDetails(itemID)
    {

        // encode the itemID for security purposes
        const encodedValue = encodeURIComponent(itemID);

        // a fetch call is made to the server containing the ID of the
        // item to be gotten.
        fetch(`http://192.168.1.71:5000/listing/${encodedValue}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            //    body: JSON.stringify(payload),
        })
            // Then, the item data is sent back as a JSON response
            .then((res) => res.json())
            .then((json) =>{
                // The current state is updated to the item details gotten from
                // the backend
                console.log(json.data);
                this.setState({listingDetails: json.data});

                console.log("vvvvvvv");
                // as the image URI requires additional processing, it is fetched
                // separately from the rest of the text data
                this.setState({imageURI: json.data.photoData["_parts"][0][1]["uri"] });
            })
            .catch(err => {
                // Inform the user if there is an error
                console.log(err);
            });
    }

    // https://stackoverflow.com/questions/66136800/geocoding-issue-in-react-native-geocoding

    // itemLocation
    // This function makes a call to the Google API to perform reverse Geocoding, or
    // coming up with a location name based on latitude and longitude coordinates

    async itemLocation(){
        const {listingDetails} = this.state;
        var lat = 50;
        var lon = -50;
        if(typeof(listingDetails["loc"]) !== "undefined") {
            console.log(listingDetails["loc"]["coordinates"]);
            lon = listingDetails["loc"]["coordinates"][0];
            lat = listingDetails["loc"]["coordinates"][1];
        }

        fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + lon + ',' + lat + '&key=' + 'AIzaSyDu0WpjRZ9Qnv6voCpdfXteR_9y0Vc0f2k')
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('ADDRESS GEOCODE: ' + JSON.stringify(responseJson));
                if(typeof(responseJson["error_message"]) === "undefined") {
                    this.setState({itemLocation: JSON.stringify(responseJson)});
                }
            })
            .catch(error => console.log(error));
    }

    // tweetNow
    // This function uses React Native Linking in order to link to
    // a social media app and allow users to post information about
    // an item on Twitter
    tweetNow = () => {
        let twitterParameters = [];
        // If the user wants to share a link, then it is pushed into the twitterParameters
        // array
        const {twitterShareURL, tweetContent} = this.state;
        const {listingDetails} = this.state;
        let shareURL = twitterShareURL + listingDetails.itemid;

        if (shareURL)
            twitterParameters.push('url=' + encodeURI(shareURL));
        // If the user wants to share a tweet, then it is pushed into the twitterParameters
        // array
        if (tweetContent)
            twitterParameters.push('text=' + encodeURI(tweetContent));
        // Create the URL to share the tweet text with
        const url =
            'https://twitter.com/intent/tweet?'
            + twitterParameters.join('&');
        Linking.openURL(url)
            .then((data) => {
                alert('Twitter Opened');
            })
            .catch(() => {
                alert('Something went wrong');
            });
    };

    // postOnFacebook
    // This function uses React Native Linking in order to link to
    // a social media app and allow users to post information about
    // an item on Facebook

    postOnFacebook = () => {
        let facebookParameters = [];
        const {facebookShareURL, postContent} = this.state;
        const {listingDetails} = this.state;
        let shareURL = facebookShareURL + listingDetails.itemid;

        // If the user wants to share a link, then it is pushed into the facebookParameters
        // array
        if (shareURL)
            facebookParameters.push('u=' + encodeURI(facebookShareURL));
        // If the user wants to share a tweet, then it is pushed into the facebookParameters
        // array
        if (postContent)
            facebookParameters.push('quote=' + encodeURI(postContent));
        // create a url to share the content with parameters
        const url =
            'https://www.facebook.com/sharer/sharer.php?' +
            facebookParameters.join('&');

        // Linking allows React Native to connect to an external app
        Linking.openURL(url)
            .then((data) => {
                alert('Facebook Opened');
            })
            .catch(() => {
                alert('Something went wrong');
            });
    };

    // render displays the UI to the user and stores default variables that can be updated
    // by the state.
    render() {
        const {navigate} = this.props.navigation;
        const {listingDetails} = this.state;
        const {twitterShareURL, tweetContent, facebookShareURL, postContent} = this.state;

        // notably, imageURI needs to be saved by the state because it takes longer to render
        // than the text
        const {imageURI} = this.state;

        // save the current location gotten from geocoding
        const {itemLocation} = this.state;

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
                <ScrollView vertical={true} contentContainerStyle={styles.itemStyle}>
                    <View>
                        <Image
                            style={styles.imageStyle}
                            source={{
                                uri: imageURI,
                            }}
                        />
                    </View>
                    <Text>{imageURI}</Text>
                    <Text style={styles.headerStyle}>{listingDetails.title}</Text>
                    <Text style={styles.textStyle}>{listingDetails.user}</Text>
                    <Text style={styles.informationStyle}>{listingDetails.size} * Good * {listingDetails.brand}</Text>
                    <Text style={styles.textStyle}>£ {parseFloat(listingDetails.price)}</Text>

                    <View style={{marginTop: 5, alignItems: 'center'}}>
                        <TouchableOpacity style={styles.buttonStyle}
                                          onPress={() => this.props.navigation.navigate(
                                        'FavouriteItems',
                                        { passedItem: this.state }
                        )}>
                            <Text style={styles.textStyle}>Favourite</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{marginTop: 5, alignItems: 'center'}}>
                        <TouchableOpacity style={styles.buttonStyle}
                                          onPress={console.log("This option is not yet available!")}>
                            <Text style={styles.textStyle}>Buy</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.titleStyle}>Description  </Text>
                    <Text style={styles.headerStyle}>{listingDetails.description}</Text>
                    <Text style={styles.categoryStyle}>Category:      {listingDetails.selectedCategory}</Text>
                    <Text style={styles.categoryStyle}>Size:      {listingDetails.size}</Text>
                    <Text style={styles.categoryStyle}>Condition:      {listingDetails.selectedCondition}</Text>
                    <Text style={styles.categoryStyle}>Location:      {itemLocation}</Text>

                    <View style={{marginTop: 5, alignItems: 'center'}}>
                        <TouchableOpacity style={styles.buttonStyle}
                                          onPress={this.postOnFacebook} >
                            <Text style={styles.textStyle}>Post to Facebook</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{marginTop: 5, alignItems: 'center'}}>
                        <TouchableOpacity style={styles.buttonStyle}
                                          onPress={this.tweetNow} >
                            <Text style={styles.textStyle}>Post to Twitter</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
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
    buttonStyle: {
        width: 200,
        borderRadius: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'powderblue',
    },
    textStyle:
        {
            fontSize: 20,
            textAlign: 'justify',
            margin: 5,
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
            textAlign: 'justify',
            margin: 5,
            backgroundColor: "#dfdddf",
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
