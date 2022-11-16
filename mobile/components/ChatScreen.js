/**
 *
 * ChatOverview.js
 * Author: Megan Powers (21146284), referenced from
 * an algorithm by Mr. Rahul:
 * https://www.finetricks.com/simple-way-chat-application-in-react-native-nodejs-and-mongodb/
 *
 * 29/04/2022
 *
 * ChatScreen provides functionality for a user to send a message to another user.
 * It uses a combination of fetch calls to the backend and AsyncStorage to get
 * user information and get/post messages to the backend. The chat is based on
 * GiftedChat, a React Native package that provides support for chatting.
 *
 * */

// Basic React functionality is imported to support the application
 import React, { useState, useCallback, useEffect } from 'react'

// React Native-specific components that are used on this page are brought in
 import {View} from 'react-native';

 //GiftedChat is used as a means of talking to another user
 import { GiftedChat } from 'react-native-gifted-chat'

// AsyncStorage is used to store user details
 import AsyncStorage from '@react-native-async-storage/async-storage';

 // Spinner allows for user-friendliness by informing them that the chat is
// still loading - it lets them know something is happening
 import Spinner from 'react-native-loading-spinner-overlay';


/**
 *
 * ChatScreen
 * @param props
 * @returns {JSX.Element}
 * @constructor
 *
 * ChatScreen presents the general overview of the chat screen. It contains
 * data for the messages, as well as whether the chat has loaded yet.
 * It fetches user data and posts information to the server about the channel,
 * and updates so that new messages show up.
 *
 */
 const ChatScreen = (props) => {

     // Create default variables based on the current state
    // so that the user, all messages, and whether the chat is still loading can be stored
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({});

    // useEffects is a hook that lets React know that it needs to
    // do something after rendering. In this case, it gets the current user's information
    // and displays messages saved in mongodb.

    useEffect(() => {

        // is the chat mounted yet?
        let isMounted = true;

        const getDoc = async () => {

            // Wait to fetch information about the current, logged-in user from local storage
            await AsyncStorage.getItem("userData").then(async (data) => {

                // If the chat is ready to display, then fetch the user data in JSON format
                if (isMounted) {
                    console.log(JSON.parse(data))

                    // Set the current user to the data fetched from AsyncStorage
                    setUser(JSON.parse(data));

                    // Get the current user from the data
                    let val = JSON.parse(data)

                    console.log(val._id)

                    // Check if the user ID is valid.
                    if(val._id){

                        // Create a payload to send information to the server about
                        // the current chat channel,
                        let sdata = {
                            method: 'POST',
                            //credentials: 'same-origin',
                            //mode: 'same-origin',
                            body: JSON.stringify({
                                "channel_id":'channel_id'
                            }),
                            headers: {
                                'Accept':       'application/json',
                                'Content-Type': 'application/json',
                                //'X-CSRFToken':  cookie.load('csrftoken')
                            }
                        }

                        // Wait for messages to be fetched from the backend
                        await fetch('http://192.168.1.71:5000/get_messages', sdata)

                            // When there is a response, return it in JSON format
                            .then((response) => response.json())
                            .then(async (json) => {
                                console.log(json)

                                // If the status is valid and the data is present,
                                // then map the current message to the array that
                                // stores information about messages in the chat
                                if(json.status && json.data && json.data.length>0) {
                                    let arr = []
                                    let count = 1;
                                    json.data.map((val2,key)=>{
                                        console.log(val2)
                                        arr.push(val2.message)

                                        // To display messages in chronological order,
                                        // they need to be reversed.

                                        if(count===json.data.length)
                                        {
                                            let reverse = [...arr].reverse()
                                            setMessages(reverse)
                                        }
                                        // Add one to the total number of messages
                                        count++;
                                    })
                                } else if(!json.status)
                                    // If there is an error, print that out
                                    console.log(json.msg)
                                // The chat is no longer loading
                                setLoading(false);
                                //setdisTime({distance:json.data.distance,time:json.data.time_taken})

                            })
                    }
                }
            })

        }

        // Allows for there to be an interval for how long the chat takes to load.
        // If the chat takes too long, then unmount the chat and reset the interval.
        let interval = setInterval(()=>getDoc(),4000)
        return () => { isMounted = false; clearInterval(interval); }; // cleanup toggles value, if unmounted

    }, [])

    // useCallback returns a version of the contents that only changes if
    // something within the components has changed. This is used to add a message
    // to the messages in the chat, which will update if something has changed.

    const onSend = useCallback((messages = [],userid) => {

        console.log(userid)
        //if the user id is valid, then set the GiftedChat messages to reflect
        // all messages that were previously sent
        if(userid){
            console.log(messages[0])
            setMessages(previousMessages => GiftedChat.append(previousMessages, messages))

            // Create a payload with information about the message
            let data = {
                method: 'POST',
                //credentials: 'same-origin',
                //mode: 'same-origin',
                body: JSON.stringify({
                    "channel_id":'channel_id',
                    "userid":userid,
                    "message":messages[0],
                }),
                headers: {
                    'Accept':       'application/json',
                    'Content-Type': 'application/json',
                    //'X-CSRFToken':  cookie.load('csrftoken')
                }
            }

            // Send a fetch request to the backend to add a new message to the
            // database
            fetch('http://192.168.1.71:5000/add_message',data)
                .then((response) => response.json())
                .then(async (json) => {
                    console.log(json); //return;
                })
        }

    }, [])

    // As long as the chat is still loading, show the spinner to the user
    // to let them know that something is happening

    if (loading) {
        return (<View><Spinner visible={loading} /></View>);
    }

    /**
     *
     * Comments for the return function are put above because of problems with
     * rendering for in-line comments.
     *
     * GiftedChat is an additional package that provides support for chat functionality.
     * The contents of this screen are displayed inside of the GiftedChat UI.
     *
     * Messages are the current messages stored in the database.
     * When a message is sent, the user who sent the message's id is appended.
     * The user who instigated the chat's details are saved.
     *
     */
    return (
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages,user.userid)}
            user={{
                _id: user.userid,
                name: user.username,

            }}
        />
    )
}
 /*avatar: auth?.currentUser?.photoURL*/

// Export the ChatScreen for use elsewhere
export default ChatScreen;

