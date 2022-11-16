/**
 *
 * UploadListing.js
 * Author: Megan Powers (21146284)
 *
 * 29/04/2022
 *
 * UploadListing allows the user to input information about an item,
 * including an image, information, and the location coordinates of the user
 * to present where the user is currently located.
 *
 * */

// import the basic React component and library
import React, {Component, useEffect, useState} from 'react';

// import react-native specific components
import {
    StyleSheet,
    View,
    Button,
    Text,
    FlatList,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Picker,
    Image,
    Platform,
    PermissionsAndroid
} from 'react-native';


// Geolocation must be used to store information about the user's location when
// uploading
import Geolocation from "@react-native-community/geolocation";
// AsyncStorage is used to fetch the user's username to
import AsyncStorage from "@react-native-async-storage/async-storage";

// The image library is used to support the user uploading an image
import { launchImageLibrary } from 'react-native-image-picker';


// UploadListing
// params: navigation
// UploadListing is a function that allows a user to upload
// an item to the app. It has several state variables that
// update when the user uploads a file. The data
// is sent to the server and then subsequently
// stored in the db.
const UploadListing = ({navigation}) => {

    // Set the initial state values
    const [selectedCategory, setCategory] = useState("N/A");
    const [selectedCondition, setCondition] = useState("N/A");
    const [isSelected, setSelection] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [brand, setBrand] = useState('');
    const [size, setSize] = useState('');
    const [price, setPrice] = useState('');
    const [currentLongitude, setCurrentLongitude] = useState('2.4333');
    const [currentLatitude, setCurrentLatitude] = useState('53.5500');
    const [user, setUser] = useState('');
    const [photo, setPhoto] = useState();

    const [
        locationStatus,
        setLocationStatus
    ] = useState('');

    // createFormData
    // params: photo, body
    // This function creates a multipart form for images
    // based on the image passed as a parameter, which is needed to
    // store it in MongoDB properly.
    const createFormData = (photo, body = {}) => {
        const data = new FormData();
        // get information from the photo such as the file name and type,
        // save the uri depending on the platform, which automatically appends
        // file:// to the start of a file uri, which causes problems in displaying images
        data.append('photo', {
            name: photo.fileName,
            type: photo.type,
            uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
        });

        // for every image feature, append to the object
        Object.keys(body).forEach((key) => {
            data.append(key, body[key]);
        });

        return data;
    };

    // useEffect is a hook that reloads every time after the render loads,
    // it allows for data that is not in the
    // render to update
    useEffect(() => {
        // Request location permissions from the user to allow for
        // location settings registration
        const requestLocationPermission = async () => {
            if (Platform.OS === 'ios') {
                getLocation();
            } else {
                try {
                    // android devices require additional access to location
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        {
                            title: 'Location Access Required',
                            message: 'This App needs to Access your location',
                        },
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        // if the permission is granted, get the user location
                        getLocation();
                    } else {
                        setLocationStatus('Permission Denied');
                    }
                } catch (err) {
                    console.warn(err);
                }
            }
        };
        // make a call to request location permission
        requestLocationPermission();
        return () => {
            console.log('success');
        };
    }, []);

    // onSubmitHandler runs when information is submitted using TouchableOpacity
    // in this case, it will take the current
    // user's username and create a form from information stored in the
    // photo field, and a payload from information stored in the other fields. Then,
    // it will create a
    // payload to send the information to the server
    const onSubmitHandler = async() => {
        // get the current user's username
        var user = await AsyncStorage.getItem('username');

        console.log("bbbbbiiii");
        console.log(photo);

        // make a form from the photo information
        var photoData = createFormData(photo["assets"][0], { userId: user });

        console.log("aaaaaa");
        console.log(photoData["_parts"][0][1]["uri"]);

        const payload = {
            user,
            photoData,
            title,
            description,
            selectedCategory,
            brand,
            selectedCondition,
            size,
            price,
            currentLatitude,
            currentLongitude
        };

        console.log(payload);

        // send a fetch request to the backend to insert
        // the item information into the db.
        fetch('http://192.168.1.71:5000/uploadItem', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
        })
            .then(async res => {
                try {
                    // the response's json is recovered
                    const jsonRes = await res.json();
                    console.log(res.status);
                    if (res.status !== 200) {
                        // if the insertion was not successful, then there was an error
                        alert("Item not able to be uplaoded.");
                        setIsError(true);
                        setMessage(jsonRes.message);
                    } else {
                        // otherwise, the item was put in the db
                        alert("Item uploaded!");
                        navigation.navigate('Home');
                        setIsError(false);
                        setMessage(jsonRes.message);
                    }
                } catch (err) {
                    console.log(err);
                };
            })
            // check for errors
            .catch(err => {
                console.log(err);
            });
    };

    // getLocation
    // This function will use Geolocation to get the current user position
    // based on latitude and longitude coordinates. This information is
    // stored as a point in the db, and is used in the searchbar to order
    // items by closest values
    const getLocation = () => {

        Geolocation.getCurrentPosition(
            //get the current location position
            (position) => {

                // get the current longitude from the user position
                const currentLongitude =
                    JSON.stringify(position.coords.longitude);

                //get the current latitude from the user position
                const currentLatitude =
                    JSON.stringify(position.coords.latitude);


                console.log(currentLongitude);
                // set in state the user's present longitude
                setCurrentLongitude(currentLongitude);

                // set the user's present latitude
                setCurrentLatitude(currentLatitude);

            },
            (error) => {
                alert(error);
            },
            // do not enable high accuracy for the user's location
            {
                enableHighAccuracy: false,
                timeout: 30000,
                maximumAge: 1000
            },
        );
    };

    // handleChoosePhoto
    // this function launches the image library and enables the user to select an image on their
    // phone

    const handleChoosePhoto = () => {

        launchImageLibrary({ noData: true }, (response) => {
            // console.log(response);
            if (response) {
                // if there is a response, set the photo state variable
                console.log(response);
                setPhoto(response);
                console.log(photo);
            }
        });
    };

    /**
     *
     * Comments for the return function are put above because of problems with
     * rendering for in-line comments.
     *
     * The form is held in a scrollview so that the user can reach the rest of the form
     * when they see the image preview. TextInput fields are used to store information
     * that then updates in state, and the geolocation coordinates are fetched
     * using a TouchableOpacity press.
     *
     * TouchableOpacity is also used to upload the item and navigate to the
     * home page using the navigation property.
     *
     */

    var imgURI = "";

    if(typeof(photo) !== "undefined"){
        if(typeof(photo["assets"]) !== "undefined"){
            imgURI = photo["assets"][0]["uri"];
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {photo && (
                    <Image
                        source={{ uri: imgURI }}
                        style={{ width: 300, height: 400 }}
                    />
                )}
                <TouchableOpacity style={styles.buttonStyle}
                                  onPress={handleChoosePhoto}>
                    <Text style={styles.header}>Choose Photo</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.header}>Title</Text>
            <TextInput style={styles.input} onChangeText={setTitle}/>
            <Text style={styles.header}>Description</Text>
            <TextInput style={styles.input} multiline={true} onChangeText={setDescription}/>
            <Text style={styles.header}>Category</Text>
            <Picker
                selectedCategory={selectedCategory}
                style={styles.dropdownmenu }
                onValueChange={(categoryValue, itemIndex) => setCategory(categoryValue)}
            >
                <Picker.Item label="Clothing & Shoes" value="Clothing&Shoes" />
                <Picker.Item label="Gifts" value="Gifts" />
                <Picker.Item label="Jewellery & Accessories" value="Jewellery&Accessories" />
                <Picker.Item label="Home & Lifestyle" value="Home&Lifestyle" />
                <Picker.Item label="Wedding & Special Occasion" value="Wedding" />
                <Picker.Item label="Hobbies & Entertainment" value="Hobbies" />
                <Picker.Item label="Art" value="Art" />
                <Picker.Item label="Craft Supplies" value="CraftSupplies" />
                <Picker.Item label="Vintage" value="Vintage" />
            </Picker>
            <Text style={styles.header}>Brand</Text>
            <TextInput style={styles.input} onChangeText={setBrand}/>
            <Text style={styles.header}>Condition</Text>
            <Picker
                selectedCondition={selectedCondition}
                style={styles.dropdownmenu }
                onValueChange={(conditionValue, itemIndex) => setCondition(conditionValue)}
            >
                <Picker.Item label="New" value="New" />
                <Picker.Item label="Excellent" value="Excellent" />
                <Picker.Item label="Good" value="Good" />
                <Picker.Item label="Used" value="Used" />
                <Picker.Item label="Other" value="Other" />
            </Picker>
            <Text style={styles.header}>Size</Text>
            <TextInput style={styles.input} onChangeText={setSize}/>
            <Text style={styles.header}>Price</Text>
            <TextInput style={styles.input} onChangeText={setPrice}/>
            <TouchableOpacity style={styles.buttonStyle} onPress={getLocation}>
                <Text style={styles.textStyle}>Add Location</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonStyle} onPress={onSubmitHandler}>
                <Text style={styles.textStyle}>Upload</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

// Styles focus on creating easy to read input fields
// and displaying the TouchableOpacity fields.
const styles = StyleSheet.create({
    input: {
        borderColor: "gray",
        width: 300,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginLeft: 10,
        marginRight: 10
    },
    dropdownmenu: {
        width: "100%",
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginRight: 100,
        backgroundColor: "#dfdddf"
    },
    header:{
        fontSize: 20,
        textAlign: 'justify',
        margin: 5,

    },
    buttonStyle:{
        borderRadius: 50,
        margin: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "powderblue",
    },
    textStyle:{
        fontSize: 25,
        textAlign: 'justify',
        margin: 5,

    }
});

// export UploadListing for use elsewhere.
export default UploadListing;
