/**
 *
 * TrendingItems.js
 * Author: Megan Powers (21146284)
 *
 * 29/04/2022
 *
 * TrendingItems is a component that displays items based off of a criteria
 * that can be specified in this class. It fetches items from the backend
 * based on a specified criteria, and updates a list in state to display
 * items based on the specified criteria.
 *
 * */

// import the basic React component and library
import React, {Component} from 'react';

// import react-native specific components
import {ActivityIndicator, StyleSheet, View,  FlatList, TouchableOpacity} from 'react-native';

// import the ListItem component
import ListItem from './ListItem';

// TrendingItems has the supertype Component and can access features from that,
// including a constructor that initializes state variables
export default class TrendingItems extends Component{
    // the construtor initializes the state variables
    constructor(props) {
        // make a call to the constructor in supertype
        super(props);


        this.state = {
            // itemList contains all of the 'trending' items gotten from the backend
            itemList: [],

            // 'isLoading' is a flag that checks whether items are done being returned
            isLoading: true,

            // this search term can be modified depending on what should be shown to the user
            searchTerm: 'jean',
        };
    }

    // componentDidMount is automatically called when components mount/render
    componentDidMount()
    {
        // when the components render, get and display the current list of items in storage
        this.getItemList();
    }

    // getItemList
    // This function gets a term from state and then makes a call to the backend to
    // return relevant items
    getItemList()
    {

        // Specifies the criteria that items will be returned by
        const searchItem = this.state.searchTerm;

        const encodedValue = encodeURIComponent(searchItem);

        console.log(searchItem);

        // make a fetch GET call to the server based on the passed-in value, and
        // return the items matching the term
        fetch(`http://192.168.1.71:5000/trending_items/${encodedValue}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            //    body: JSON.stringify(payload),
        })
            .then(async res => {
                try {
                    // get the JSON payload as a response
                    const jsonRes = await res.json();
                    console.log(res.status);
                    if (res.status === 200) {
                        // if successful, set the list of items to the items returned from db
                        console.log(jsonRes.data);
                        this.setState({itemList: jsonRes.data});
                    } else {
                        // Otherwise, no items are brought back/set
                        console.log("error!")
                    }
                } catch (err) {
                    console.log(err);
                };
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                // after fetching the list of items, make sure the state is no longer loading
                this.setState({ isLoading: false });
                // display items
                console.log("Items found for " + this.state.searchTerm + " = " + JSON.stringify(this.state.itemList));
            });

    }

    // the render method dispays the UI to the user, and serves to initialize state variables
    render() {
        // navigation so the user can click on items they want to see
        const { navigation } = this.props;

        // initialize state variables
        const { itemList, isLoading, searchTerm } = this.state;

        // an empty item object is initialized in case there are no items to show
        // so the user has some default item to see. photo data object also needs to be
        // initialized in order to prevent null object error
        const emptyItemObject =
            {
                "title": "No items to show.",
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
         * This is a component that is meant to be included in other pages, so
         * it only displays a FlatList of items based on criteria specified
         * through the state.
         *
         * The items that are gotten from the server are stored in the state and
         * fetched using a FlastList, before being displayed using TouchableOpacity
         * so the user can navigate there.
         *
         */
        return (
            <View style={{ flex: 1}}>

                {isLoading ? <ActivityIndicator/> : (
                    <FlatList
                        data={itemList}
                        scrollEnabled={true}
                        keyExtractor={item => item.itemid}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => {navigation.navigate(
                                    'ListingInformation',
                                    { passedItemID: item.itemid}
                                )}}
                            >
                                <ListItem theItem={item} itemStyle={'normalItemStyle'}/>
                            </TouchableOpacity>)}
                        ListEmptyComponent = {<ListItem theItem = {emptyItemObject} itemStyle={'emptyItemStyle'} />}
                    />
                )}
            </View>
        );
    }
};
