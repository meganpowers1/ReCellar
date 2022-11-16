/**
 *
 * FavouriteItems.js
 * Author: Megan Powers (21146284), referenced from
 * the Movie example application by Harjinder Singh
 *
 * 29/04/2022
 *
 * FavouriteItems provides functionality for the current logged-in user to
 * see all the items that they favourited to save. It uses AsyncStorage
 * to save favourited items locally, rather than persisting them on the
 * database.
 *
 * */

// Basic React functionality is imported to support the application
import React, {Component} from 'react';

// React Native-specific components that are used on this page are brought in
import {ActivityIndicator, StyleSheet, View, FlatList, TouchableOpacity} from 'react-native';

// Async storage is used for on-device data persistence
import AsyncStorage from '@react-native-async-storage/async-storage';

// ListItem represents a preview of a listing that was favourited

import ListItem from './ListItem';

/**
 *
 * FavouriteItems
 *
 * FavouriteItems is a class that contains functionality for getting all the
 * listings that were saved in the local device storage. It uses state in
 * order to determine which items were saved in the list, and props to
 * get information from the search screen.
 *
 */

export default class FavouriteItems extends Component
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

            isLoading: true,
        };
    }

    // componentDidMount provides functionality for checking whether a certain component
    // is rendered/mounted. In this case, the params item that is being passed in by the "favourite"
    // button is held in the properties and is saved in the list

    async componentDidMount()
    {
        // Check whether the properties contain valid values
        if (this.props.route.params) {

            // Store the current item that was passed in before saving it
            const {passedItem} = this.props.route.params;
            await this.saveToFavourites(passedItem);
        }

        // Fetch the current item list from AsyncStorage
        await this.getItemListFromStorage();
    }

    // getItemListFromStorage fetches all the items that have already been saved in
    // local storage before placing all of them in the current itemArrayso they can
    // be rendered

    async getItemListFromStorage()
    {
        // create storage for the listings retrieved from local storage
        let itemArray = [];
        try
        {
            // the entire list of items in storage need to be fetched from asyncstorage.
            // as they are stored in key-value pairs, all of the keys need to be fetched first
            const allKeys = await AsyncStorage.getAllKeys();

            // multiGet retrieves the values associated with the keys in bulk
            const allItemRecords = await AsyncStorage.multiGet(allKeys)

            // each individual item needs to be retrieved by index value and
            // parsed out of string format before being pushed into the array for further
            // processing
            allItemRecords.map((result, i, itemRecord) => {
                let value = itemRecord[i][1];
                itemArray.push(JSON.parse(value));
            });

        }
        // detect errors and present them to console
        catch (error)
        {
            console.log(error, 'error')
        }
        finally
        {
            // assign the itemList to the current itemArray and update the state
            // to be able to display all items in the current itemList
            this.setState({itemList: itemArray});
            console.log(itemArray);

            // update the state flag now that the state has been changed and finally reached
            this.setState({isLoading: false});
        }
    }


    // saveToFavourites saves a particular listing into AsyncStorage so that
    // it can be appended to the list of items
    async saveToFavourites(itemObject)
    {
        try
        {
            // the item id will become the unique key to access the individual item,
            // and the value will be turned into a string from JSON format, as
            // asyncstorage cannot store object values.
            console.log(itemObject);
            await AsyncStorage.setItem(itemObject['listingDetails'].itemid, JSON.stringify(itemObject['listingDetails']));

            // alert the user that the item was saved successfully
            alert(itemObject['listingDetails'].title + ' saved!');
        } catch (e)
        {
            // else, alert the user of an error
            alert(e.message);
        }
    }

    // this function serves to delete an item from the list of favourites - it
    // takes in an item name in order to fetch the corresponding value,
    // and removes the item from asyncstorage
    async deleteFromFavourites(itemTitle) {
        try
        {
        //    console.log("title")
            console.log(itemTitle)
            // the key of the item is the item title, which is then in turn passed in to removeItem
            await AsyncStorage.removeItem(itemTitle);
            alert('Item deleted!');
            // finally, return true if the function succeeded
            return true;
        }
        catch(exception) {
            // otherwise, the item was not removed
            return false;
        }
        finally
        {
            // this re-loads the item list in order to display the updated version
            this.getItemListFromStorage();

        }
    }


    // render serves to display the UI and current contents of the page to the user
    // and to initialize variables
    render() {

        // if the user wants to navigate to another page, navigation can be
        // passed in this way
        const { navigation } = this.props;

        // the state variables are also initialized here so they can be updated
        // based on what's going on with the page
        const { itemList, isLoading } = this.state;

        // there needs to be an empty item object to show the user tha
        const emptyItemObject =
            {
                "title": "No items SAVED in AsyncStorage Yet!",
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
         * Whether the list has loaded depends on the activity indicator. It uses a ternary
         * operator to display either the activity indicator if it's still loading, or
         * the FlatList containing the item list if it has loaded.
         *
         * Item data is individually saved and then rendered using the external ListItem
         * component. When the items are pressed for an extended period, they are
         * then removed from the favourited items.
         *
         */

        return (
            <View style={{ flex: 1}}>
                {isLoading ? <ActivityIndicator/> : (
                    <FlatList
                        data={itemList}
                        keyExtractor={item => item.itemid}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onLongPress={()=>{this.deleteFromFavourites(item.itemid)}}
                            >
                                <ListItem theItem={item} itemStyle={'savedItemStyle'}/>
                            </TouchableOpacity>)}
                        ListEmptyComponent =  {<ListItem theItem={emptyItemObject} itemStyle={'emptyItemStyle'}/>}
                    />
                )}
            </View>
        );
    }
}
