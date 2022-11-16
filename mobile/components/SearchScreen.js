/**
*
* SearchFilterScreen.js
* Author: Megan Powers (21146284), based on the Movie App by
 * Harjinder Singh
 *
* 29/04/2022
*
* SearchScreen is a component that allows the user to input a search term
* and using state to save all of the current items inside an array,
 * after fetching them. The user can also use geolocation to sort items by location.
*
* */

// import the basic React component and library
import React, {Component} from 'react';

// import react-native specific components
import {
    ActivityIndicator,
    StyleSheet,
    View,
    Button,
    Text,
    TextInput,
    FlatList,
    Alert,
    TouchableOpacity,
    Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// As the user can sort items by location, the geolocation library needs to be imported.
import {getDistance, getPreciseDistance} from 'geolib';

// Import ListItems to display search results
import ListItem from './ListItem';

// Import the search filter so React Geolocation can be implemented
import SearchFilterScreen from './SearchFilterScreen';

// SearchScreen has the supertype Component, which allows
// for SearchScreen to create a constructor to set default values.
export default class SearchScreen extends Component{

    // the Component constructor initializes the props/states for the screen
    constructor(props) {
        // Make a call to the original Component constructor
        super(props);

        // Initialize state variables
        this.state = {
            // create an array to hold the current list of items searched for
            itemList: [],

            // isLoading stores whether the values have been yet returned from the database
            isLoading: true,

            // assign a default value to searchTerm so a user can see some results
            searchTerm: '',

            currentLat: 50,

            currentLon: -50
        };
    }

    // componentDidMount is used when the components first render/mount
    async componentDidMount()
    {
        // when the page first displays, get the current list of items with the default search term
        this.getItemList();

        // Dummy data is used for the sake of the demonstration because
        // there is a known issue in Android Studio with getting geolocation data:
        // https://stackoverflow.com/questions/44085735/geolocation-not-working-on-android-emulator
        // These values are just used to show that geolocation works for sorting the list.

        await AsyncStorage.setItem('userLatitude', JSON.stringify(50));
        await AsyncStorage.setItem('userLongitude', JSON.stringify(-50));

        var lat = await this.getLat();
        var lon = await this.getLon();

        lat = parseFloat(lat);
        lon = parseFloat(lon);

        if(!isNaN(lat)){
            this.setState({currentLat: lat});
        }
        if(!isNaN(lon)){
            this.setState({currentLon: lon});
        }

    }

    // getLat
    // this function is used to get the current user's latitude
    // in order to enable geolocation
    getLat = async () => {
        // get the current user's latitude from AsyncStorage
        var lat = await AsyncStorage.getItem('userLatitude');

        // parse the value and return it
        if(lat) {
            return JSON.parse(lat);
        }
    }

    // getLon
    // this function is used to get the current user's longitude
    // in order to facilitate geolocation
    getLon = async () => {
        // get the current user's longitude from AsyncStorage
        var lon = await AsyncStorage.getItem('userLongitude');
        // parse from string format and return
        if(lon) {
            return JSON.parse(lon);
        }
    }

// calculateDistance
    // This function calculates the distance between two points using
    // geolocation lat-lon coordinate input
    calculateDistance = () => {
        var dis = getDistance(
            {latitude: 20.0504188, longitude: 64.4139099},
            {latitude: 51.528308, longitude: -0.3817765},
        );
        alert(
            `Distance\n\n${dis} Meter\nOR\n${dis / 1000} KM`
        );
    };

    // getItemList
    // This function fetches the item list based on the search term
    // fetched from the current state. This is then gotten from the
    // database before it is added to the itemList and displayed
    getItemList()
    {

        // set the item to the current state variable
        const searchItem = this.state.searchTerm;

        const encodedValue = encodeURIComponent(searchItem);

        console.log(searchItem);

        // Make a GET call to the server with the term to be searched
        fetch(`http://192.168.1.71:5000/search/${encodedValue}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            //    body: JSON.stringify(payload),
        })
            .then(async res => {
                try {
                    // Wait for the response containing the search results to come back from the server
                    const jsonRes = await res.json();
                    console.log(res.status);
                    // If successful, set the item list state to the data from the response
                    if (res.status === 200) {
                        console.log(jsonRes.data);
                        this.setState({itemList: jsonRes.data});
                    } else {
                        console.log("error!")
                    }
                    // Detect any possible errors
                } catch (err) {
                    console.log(err);
                };
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                // When the data returns, loading finishes, so the state is refreshed
                // Also, display the items
                this.setState({ isLoading: false });
                alert("Here are the results of your search!")
                console.log("Items found for " + this.state.searchTerm + " = " + JSON.stringify(this.state.itemList));
            });

    }

    // render is constantly called to display the UI to the user
    render() {
        // get navigation from the properties so the user can navigate to each
        // item gotten from the DB
        const { navigation } = this.props;

        // instantiate the state variables
        const { itemList, isLoading, searchTerm } = this.state;

        const {currentLat, currentLon} = this.state;

        var lat = 0;
        var lon = 0;


        // Create a default object to show the user if no items matching their search query
        // were retrieved from the db. photo data object also needs to be
        // initialized in order to prevent null object error
        const emptyItemObject =
            {
                "title": "No items were found matching the search term!",
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
            }


        /**
         *
         * Comments for the return function are put above because of problems with
         * rendering for in-line comments.
         *
         * The TextInput has functionality for changing the current search term based
         * on state so it can be sent to the server. It also contains onSubmitEditing,
         * a prop that calls when the submit button is pressed to get the item list.
         *
         * When the button is clicked on to search, the getItemList function is
         * called, which will fetch the list of items from the database.
         *
         * Also, the SearchFilterScreen is imported so that location settings
         * can sort items by distance.
         *
         * The FlatList displays the list stored in state, and sorts it based on
         * latitude and longitude coordinates between items in the list and the
         * user's current coordinates, which are located in AsyncStorage and
         * are gotten by SearchFilterScreen.
         *
         *
         * Empty items are displayed to the user if no items matching the search term are found
         *
         */
        return (
            <View style={{ flex: 1}}>
                <TextInput
                    style={{height: 40, marginLeft: 5, marginRight: 5, borderColor: 'black', borderWidth: 5}}
                    placeholder='Enter a search term'
                    onChangeText={(text)=>this.setState({searchTerm:text})}
                    onSubmitEditing={()=>this.getItemList()}
                    value = {searchTerm}
                />
                <View style={{marginTop: 5, alignItems: 'center'}}>
                    <TouchableOpacity style={styles.buttonStyle} onPress={()=>this.getItemList()}>
                        <Text style={styles.textStyle}>Search for Items</Text>
                    </TouchableOpacity>
                </View>
                <View style={{paddingBottom: 20, marginTop: 5, alignItems: 'center'}}>
                    <SearchFilterScreen />
                </View>

                <View style={{paddingBottom: 20, marginTop: 30, alignItems: 'center'}}>
                {isLoading ? <ActivityIndicator/> : (
                    <FlatList
                        data={itemList.sort((a,b) => {
                            const aDist = getDistance({
                                latitude: +a.lat,
                                longitude: +a.lon
                            }, {
                                latitude: currentLat,
                                longitude: currentLon,
                            })
                            const bDist = getDistance({
                                latitude: +b.lat,
                                longitude: +b.lon
                            }, {
                                latitude: currentLat,
                                longitude: currentLon
                            })
                            return aDist - bDist;
                        })}
                        keyExtractor={item => item.itemid}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => {navigation.navigate(
                                    'ListingInformation',
                                    { passedItemID:item.itemid}
                                )}}
                            >
                                <ListItem theItem={item} itemStyle={'normalItemStyle'}/>
                            </TouchableOpacity>)}
                        ListEmptyComponent = {<ListItem theItem = {emptyItemObject} itemStyle={'emptyItemStyle'} />}
                    />
                )}
                </View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
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
