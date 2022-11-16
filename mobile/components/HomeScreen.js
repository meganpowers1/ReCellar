/**
 *
 * HomeScreen.js
 * Author: Megan Powers (21146284)
 *
 * 29/04/2022
 *
 * HomeScreen is the entry point for the ReCeller application. It contains links to
 * the search feature and the instructions. It also contains a selection of items
 * that update based on certain criteria.
 *
 * */

// Basic React functionality is imported to support the application
import React, { useState} from 'react';

// React Native-specific components that are used on this page are brought in
import { Button, Text, View, SafeAreaView, StyleSheet, FlatList, TouchableOpacity } from 'react-native';


// External list of items to display on the home page
import TrendingItems from './TrendingItems';


// This creates an example item that can be rendered on the home page

const Item = ({ title }) => (
    <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
    </View>
);

// HomeScreen provides a home base for the user, giving links to a search feature
// and instructions. It also provides a snippet of items that may interest the user.
// navigation is passed in so that the user can navigate to different screens

export default function HomeScreen({ navigation }) {


    /**
     *
     * Comments for the return function are put above because of problems with
     * rendering for in-line comments.
     *
     * Three main features are rendered on the home screen. They are meant to
     * provide a preview of the main purpose of the app: being able to search for items and
     * being able to look at items.
     *
     * The trending items are an external component that is imported for display.
     *
     */

    return (
        <SafeAreaView style={styles.viewStyle}>
            <TouchableOpacity style={styles.buttonStyle}
                    onPress={() => navigation.navigate('SearchScreen')}
            ><Text style={styles.textStyle}>Search for an Item</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonStyle}
                onPress={() => navigation.navigate('Details')}
            ><Text style={styles.textStyle}>Instructions</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonStyle}
                              onPress={() => navigation.navigate('FavouriteItems')}
            ><Text style={styles.textStyle}>Favourite Items</Text>
            </TouchableOpacity>

            <Text style = {{fontSize: 25, paddingTop: 10, paddingRight: 130}}>You Might Like...</Text>

            <TrendingItems navigation={navigation}/>

        </SafeAreaView>
    );
}

// Style sheet for the home screen, the content is
// displayed as a flexbox so that the items can be
// centered/put next to each other properly

const styles = StyleSheet.create({
    viewStyle: {
        flex: 1,
        padding: 15,
        justifyContent: 'space-around',
        alignItems: 'center'
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
        alignItems: 'center',
        borderRadius: 50,
        paddingTop: 15,
        marginBottom: 15,
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
    },
    title: {
        fontSize: 20,
    },
});
