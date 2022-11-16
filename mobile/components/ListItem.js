/**
 *
 * ListItem.js
 * Author: Megan Powers (21146284), based on the Movie App
 * by Harjinder Singh
 *
 * 29/04/2022
 *
 * ListItem represents an overview of a singular item to be displayed to the
 * user when they search for items or see items displayed on the home page.
 *
 * */

// import the basic React component and library
import React, {Component} from 'react';

// import react-native specific components
import {StyleSheet, View, Image, Text, TouchableHighlight} from 'react-native';

// the ListItem has the supertype Component, and can access the parent class functionality
export default class ListItem extends Component
{
    // Render serves to display information about the item. This is a basic overview of
    // listings, compared to the detailed view in ListingInformation when an item is clicked.
    render()
    {
        // Basic information about the item, such as the title and price, is displayed.
        // along with the image uri from the item
        var itemURI = '';
        if(typeof(this.props.theItem['photoData']) === 'undefined'){
            itemURI = '';
        }else{
            itemURI = this.props.theItem['photoData']['_parts'][0][1]['uri']
        }
        return (
            <View style={styles[this.props.itemStyle]}>
                <Image
                    style={styles.imageStyle}
                    source={{
                        uri: itemURI,
                    }}
                />
                <Text style = {styles.textStyle}>{this.props.theItem.title} * £{this.props.theItem.price}</Text>
            </View>)
    }

}

// The stylesheet defines the appearance of the items. Three variations on
// items based on state are displayed through this stylesheet - an empty
// component is pink, a normal item is purple, and a saved item is blue.

const styles = StyleSheet.create
({
    textStyle:
        {
            fontSize: 20,
            textAlign: 'center',
            margin: 10,
        },
    imageStyle:
        {
            width: 50,
            height: 50,
            flexWrap: 'wrap',
            resizeMode: 'stretch',
        },
    normalItemStyle:
        {
            backgroundColor: '#ddd9eb',
            flexDirection: 'row',
            borderRadius: 10,
            flexWrap: 'wrap',
            padding: 10,
            margin: 10,
        },
    emptyItemStyle:
        {
            backgroundColor: 'pink',
            flexDirection: 'row',
            borderRadius: 10,
            flexWrap: 'wrap',
            padding: 10,
            margin: 10,
        },
    savedItemStyle:
        {
            backgroundColor: 'lightblue',
            flexDirection: 'row',
            borderRadius: 10,
            flexWrap: 'wrap',
            padding: 10,
            margin: 10,
        },
});
