/**
 *
 * app.js
 * Author: Megan Powers (21146284)
 *
 * 29/04/2022
 *
 * app.js is the main file that contains the backend for
 * communicating with MongoDB. It relies on express
 * and requests to communicate with the database.
 *
 * */

// required libraries for Express
var express = require('express');
var app = express();
// required library for MongoDB
var MongoClient = require('mongodb').MongoClient;
// the port that MongoDB runs on
var url = "mongodb://127.0.0.1:27017/";

var appRouter = require('./routes/routes.js')
var cors = require('cors');
// for application security
const crypto = require("crypto");
const bcrypt = require('bcrypt');
// the port that the backend and frontend communicate on
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');
// to create session
var jwt = require('jsonwebtoken');
// to store image information
const multer = require("multer");
// to parse form data
var bodyParser = require('body-parser');
const fs = require("fs");
app.use(cors());
app.use(express.json());

// to use objects in MongoDB
var ObjectId = require('mongodb').ObjectID;

app.use("/routes", appRouter);

// to validate the registration details
const { User, validate } = require('./models/user.js');
// to access device storage to store images
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

var upload = multer({ storage: storage });


// /updateUsername allows the user to input in
// a new username, which will be updated in the database
app.post('/updateUsername', async(req, res, next) => {
    /**
     const { error } = validate(req.body);
     if (error) {
        return res.status(400).send(error.details[0].message);
    }
     */
        // create object with user info
    let userData = {
            currUser: req.body.currUsername,
            username: req.body.username,
        }

    console.log(userData.currUser);
    console.log(userData.username);

    MongoClient.connect(url, async(err, db) => {
        if (err) throw err;
        var dbo = db.db("listingsDB");

        var collection = dbo.collection('users');  // get reference to the collection

        // check if user exists in users already
        dbo.collection('users').find({"username": userData.currUser}, {$exists: true}).toArray(function (err, doc) //find if a value exists
            {
                // if the user does exist, then compare the user password and the payload
                //    console.log(doc[0].username)
                if (doc && doc.length)
                {
                    var newvalues = { $set: { username: userData.username } };
                    dbo.collection("users").updateOne({"username": userData.currUser}, newvalues, function(err, res) {
                        if (err) throw err;
                    });
                    res.status(200).json({message: "username was updated", data: userData.username});
                    console.log("Username updated.");
                } else // if it does not
                {
                    // the user credentials do not exist
                    console.log("Error");
                    res.status(400).json({message: "user does not exist"});

                }
            }
        )
    });
    //res.send(userData);
});

// /updateEmail allows the user to input a new email, which
// will then be updated in the database
app.post('/updateEmail', async(req, res, next) => {
    /**
     const { error } = validate(req.body);
     if (error) {
        return res.status(400).send(error.details[0].message);
    }
     */

        // create object with user info
    let userData = {
            username: req.body.currUser,
            email: req.body.email
        }

    console.log(userData);

    MongoClient.connect(url, async(err, db) => {
        if (err) throw err;
        var dbo = db.db("listingsDB");

        var collection = dbo.collection('users');  // get reference to the collection

        // check if user exists in users already
        dbo.collection('users').find({"username": userData.username}, {$exists: true}).toArray(function (err, doc) //find if a value exists
            {
                // if the user does exist, then update the user's
                //email based on the payload
                if (doc && doc.length)
                {
                    var newvalues = { $set: { email: userData.email } };
                    dbo.collection("users").updateOne({"username": req.body.currUser}, newvalues, function(err, res) {
                        if (err) throw err;
                    });
                    console.log("Email was updated");
                    res.status(200).json({message: "email was updated"});

                } else // if it does not
                {
                    // the user credentials do not exist
                    res.status(400).json({message: "user does not exist"});

                }
            }
        )
    });
    //res.send(userData);
});

// /updatePassword takes in the new password that the user
// wants to set in the database and updates the user's password in
// the collection
app.post('/updatePassword', async(req, res, next) => {
    /**
     const { error } = validate(req.body);
     if (error) {
        return res.status(400).send(error.details[0].message);
    }
     */

        // create object with user info
    let userData = {
            username: req.body.currUserVal,
            password: req.body.password
        }

    console.log(userData.username);

    MongoClient.connect(url, async(err, db) => {
        if (err) throw err;
        var dbo = db.db("listingsDB");

        var collection = dbo.collection('users');  // get reference to the collection

        // check if user exists in users already
        dbo.collection('users').find({"username": userData.username}, {$exists: true}).toArray(function (err, doc) //find if a value exists
            {
                // if the user does exist, then compare the user password and the payload
                //    console.log(doc[0].username)
                if (doc && doc.length)
                {
                    console.log("in doc");
                    console.log(userData.password);
                    bcrypt.hash(userData.password, 12, (err, passwordHash) => {
                        if (err) {
                            console.log(err);
                            console.log("error hashing password!");
                            return res.status(500).json({message: "couldn't hash the password"});
                        } else if (passwordHash) {
                            userData.password = passwordHash;
                            var newvalues = { $set: { password: userData.password } };
                            // update the user password in the db
                            dbo.collection("users").updateOne({"username": req.body.currUserVal}, newvalues, function(err, res) {
                                if (err) throw err;
                            });
                            res.status(200).json({message: "password was updated", data: userData.password});

                        };
                    }); // end of hash

                } else // if it does not
                {
                    // the user credentials do not exist
                    console.log("user not in db.");
                    res.status(400).json({message: "user does not exist"});

                }
            }
        )
    });
    //res.send(userData);
});


// add_message communicates with the fetch call in React Native to
// add a message to a specified chat
app.post('/add_message', async(req, res, next) => {
    // Saves to MongoDB
    MongoClient.connect(url, async function(err, db) {
        if (err) throw err;
        // Access the listings database and creates timestamps
        var dbo = db.db("listingsDB");
        var d = new Date();
        var ctime = d.getTime();
        // gets a specified channel object from the request
        var myobj = { channel_id: req.body.channel_id, userId: req.body.userid, message: req.body.message, timestamp: ctime };
        // insert a new message into the chat collection in the database
        await dbo.collection("chat").insertOne(myobj, function(err, res) {
            if (err) throw err;
            db.close();
        });
        // Send back success if the message was added
        res.status(200).json({'msg': 'Chat was added successfully!', 'status': 1});

    });
});


// get_messages fetches the contents of a chat from the
// listingsDB and returns them to the frontend in React Native

app.post('/get_messages', async(req, res, next) => {
    // Get the messages from the listingsDB
    MongoClient.connect(url, async function(err, db) {
        if (err) throw err;
        var dbo = db.db("listingsDB");
        console.log(req.params.id)
        // get the corresponding chat channel from the params
        var myobj = { 'channel_id': ObjectId(req.params.id) };
        const document = await dbo.collection("chat").countDocuments(myobj)
        console.log(document)
        // if there is a document containing the chat messages, then aggregate them
        if(document>0){
            // get all messages associated with a user chat and send them back as array
            await dbo.collection("chat").aggregate([
                { $match : myobj },
                { $lookup:
                        {
                            from: 'users',
                            localField: 'userid',
                            foreignField: '_id',
                            as: 'user'
                        }
                }
            ]).toArray(function(err, res2) {
                if (err) throw err;
                // timeout if the chat takes too long to return
                if(res2.length>0){
                    db.close();
                    setTimeout(() => { res.status(200).json(res2)}, 1000);
                }else res.status(200).json([]);
                //console.log(res2);
                return false;
            });
        }else {
            // nothing is returned
            res.status(200).json([]);
        }

    });
});

// /listing/:itemID gets an item based on the item's id from the
// database and then sends the item data back to the frontend
app.get('/listing/:itemID', async(req, res, next) => {
    /**
     const { error } = validate(req.body);
     if (error) {
        return res.status(400).send(error.details[0].message);
    }uploadItem
     */

    // decode the encoded uri
    const ID = decodeURIComponent(req.params.itemID);
    console.log(ID);

    MongoClient.connect(url, async(err, db) => {
        if (err) throw err;
        var dbo = db.db("listingsDB");

        var collection = dbo.collection('items');  // get reference to the collection

        // find the item based on its itemid in the listingsDB
        dbo.collection('items').find({"itemid": ID}, {$exists: true}).toArray(function (err, doc) //find if a value exists
            {
                // if it exists
                if (doc && doc.length) //if it does
                {
                    // send it back to the frontend React Native
                    console.log(doc[0]);
                    console.log("it's here!")
                    return res.status(200).json({
                        ok: true,
                        data: doc[0]
                    });
                    //    res.status(400).json({message: "user exists"});

                } else // if it does not
                {
                    // otherwise, the item was not retrieved
                    return res.status(400).json({message: "item error"});
                }
            }
        )
    });
    //res.send(userData);
});

// /search/:itemID goes through the listingsDB and gets an item back by
// name, sending back to the frontend
app.get('/search/:itemID', async(req, res, next) => {

    // decode the encoded uri
    var id = decodeURIComponent(req.params.itemID);

    console.log(id);

    MongoClient.connect(url, async(err, db) => {
        if (err) throw err;
        var dbo = db.db("listingsDB");

        var collection = dbo.collection('items');  // get reference to the collection

        // find the passed-in item based off of the title.
        // regex ensures that all items matching a partial, instead of an exact
        // term are returned
        dbo.collection('items').find({"title": {$regex: '.*'+id+'.*'}}, {$exists: true}).toArray(function (err, doc) //find if a value exists
            {
                if (doc && doc.length)
                {
                    // store the item data in the response and send it
                    console.log(doc);
                    console.log(doc[0].username)
                    console.log("it's here!")
                    return res.status(200).json({
                        ok: true,
                        data: doc
                    });
                    //    res.status(400).json({message: "user exists"});

                } else
                {
                    // if the item does not exist, send that too
                    res.status(400).json({message: "item not found"});
                    console.log(doc);
                }
            }
        )
    });
    //res.send(userData);
});

// /trending_items/:itemID fetches an array of items from the db to
// send back to React Native based on a specific term
app.get('/trending_items/:itemID', async(req, res, next) => {
    /**
     const { error } = validate(req.body);
     if (error) {
        return res.status(400).send(error.details[0].message);
    }uploadItem
     */

    // decode the uri
    var id = decodeURIComponent(req.params.itemID);

    console.log(id);

    MongoClient.connect(url, async(err, db) => {
        if (err) throw err;
        var dbo = db.db("listingsDB");

        var collection = dbo.collection('items');  // get reference to the collection

        // find the item based on some specified title string. regex ensures that
        // items matching the search criteria even partially are sent back
        dbo.collection('items').find({"title": {$regex: '.*'+id+'.*'}}, {$exists: true}).toArray(function (err, doc) //find if a value exists
            {
                if (doc && doc.length) //if it does
                {
                    // send items back
                    console.log(doc);
                    console.log(doc[0].username)
                    console.log("it's here!")
                    return res.status(200).json({
                        ok: true,
                        data: doc
                    });
                    //    res.status(400).json({message: "user exists"});

                } else
                {
                    // if the item is not found, send a response that it was not
                    res.status(400).json({message: "item not found"});
                    console.log(doc);
                }
            }
        )
    });
    //res.send(userData);
});

// uploadItem takes an item in from the frontend, and then
// puts the item inside of MongoDB
app.post('/uploadItem', upload.array('photo', 3), async(req, res, next) => {
    /**
     const { error } = validate(req.body);
     if (error) {
        return res.status(400).send(error.details[0].message);
    }
     */

    console.log(req.file);
    console.log(req.files);
    /**
     var img = fs.readFileSync(req.file.path);
     var encode_img = img.toString('base64');
     var final_img = {
        contentType:req.file.mimetype,
        image:new Buffer(encode_img,'base64')
    };

     console.log(final_img);

     */

    // create an object from the data passed in
    let itemData = {
        itemid: crypto.randomBytes(16).toString("hex"),
        user: req.body.user,
        photoData: req.body.photoData,
        title: req.body.title,
        description: req.body.description,
        selectedCategory: req.body.selectedCategory,
        brand: req.body.brand,
        selectedCondition: req.body.selectedCondition,
        size: req.body.size,
        price: req.body.price,
        loc : { type: "Point", coordinates: [ Number(req.body.currentLongitude), Number(req.body.currentLatitude) ] },
    }

    console.log(itemData);

    MongoClient.connect(url, async(err, db) => {
        if (err) throw err;
        var dbo = db.db("listingsDB");

        var collection = dbo.collection('items');  // get reference to the collection

        // find if that specific item is already in the db
        dbo.collection('items').find({"itemid": req.body.itemid}, {$exists: true}).toArray(function (err, doc) //find if a value exists
            {
                if (doc && doc.length)
                {
                    // if that specific item exists, do not insert it
                    console.log(doc[0].username)
                    console.log("it's here!")
                    res.status(400).json({message: "item exists"});
                } else
                {
                    // create an index on the lat-lon points so it can be properly stored in mongodb
                    dbo.collection("items").createIndex( { loc : "2dsphere" } );
                    // insert item and let the user know it's successful
                    res.status(200).json({message: "item created"});
                    dbo.collection("items").insertOne(itemData, function(err, res) {
                        if (err) throw err;
                        console.log("1 item inserted");
                        db.close();
                    });

                }
            }
        )
    });
    //res.send(userData);
});

// /register takes in the user details of a new account and then
// puts them inside the listingsDB MongoDB database
app.post('/register', async(req, res, next) => {
    /**
     const { error } = validate(req.body);
     if (error) {
        return res.status(400).send(error.details[0].message);
    }
     */

    // create a new object based off of the request
    let userData = {
        userid: crypto.randomBytes(16).toString("hex"),
        username: req.body.username,
        email: req.body.password,
        password: req.body.password
    }

    let userExists = {
        username: req.body.username,
    }
    console.log(userData.username);


    MongoClient.connect(url, async(err, db) => {
        if (err) throw err;
        var dbo = db.db("listingsDB");

        var collection = dbo.collection('users');  // get reference to the collection

        // check if the user already exists by comparing the username to
        // the usernames of users there
        dbo.collection('users').find({"username": req.body.username}, {$exists: true}).toArray(function (err, doc) //find if a value exists
            {
                if (doc && doc.length) //if it does
                {
                    // do not create a new user if it exists
                    console.log(doc[0].username)
                    console.log("it's here!")
                    res.status(400).json({message: "user exists"});
                } else
                {
                    // if there is not a user by that username, create a new user
                    // in users
                    res.status(200).json({message: "user created"});
                    // hash the provided password for security reasons
                    bcrypt.hash(req.body.password, 12, (err, passwordHash) => {
                        if (err) {
                            return res.status(500).json({message: "couldn't hash the password"});
                        } else if (passwordHash) {
                            userData.password = passwordHash;
                            // create the user in users
                            dbo.collection("users").insertOne(userData, function(err, res) {
                                if (err) throw err;
                                console.log("1 document inserted");
                                db.close();
                            });
                        };
                    }); // end of hash

                }
            }
        )
    });
    //res.send(userData);
});

// /private creates a json web token to record the current user session
app.get('/private', function(req, res, next) {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        return res.status(401).json({ message: 'not authenticated' });
    };
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'secret');
    } catch (err) {
        return res.status(500).json({ message: err.message || 'could not decode the token' });
    };
    if (!decodedToken) {
        res.status(401).json({ message: 'unauthorized' });
    } else {
        res.status(200).json({ message: 'here is your resource' });
    };
});

// /login allows for the user to check their credentials
// against user details in the db and then log in
app.post('/login', async(req, res, next) => {
    /**
     const { error } = validate(req.body);
     if (error) {
        return res.status(400).send(error.details[0].message);
    }
     */

    // create object with user info
    let userData = {
        username: req.body.username,
        password: req.body.password
    }

    console.log(userData.username);

    MongoClient.connect(url, async(err, db) => {
        if (err) throw err;
        var dbo = db.db("listingsDB");

        var collection = dbo.collection('users');  // get reference to the collection

        // check if user exists in users already
        dbo.collection('users').find({"username": req.body.username}, {$exists: true}).toArray(function (err, doc) //find if a value exists
            {
                // if the user does exist, then compare the user password and the payload
                //    console.log(doc[0].username)
                if (doc && doc.length)
                {

                    bcrypt.compare(req.body.password, doc[0].password, (err, compareRes) => {
                        console.log(req.body.password)
                        console.log(doc[0].password)
                        if (err) { // error while comparing
                            // the user password is incorrect
                            console.log("not here")
                            res.status(502).json({message: "error while checking user password"});
                        } else if (compareRes) {

                            // the user password and the db password are compared successfully
                            console.log(compareRes)
                            const token = jwt.sign({ email: req.body.email }, 'secret', { expiresIn: '1h' });

                            // the user is now logged in and navigated to the home page
                            res.status(200).json({
                                message: "user logged in",
                                "token": token,
                                ok: true,
                                data: doc
                            });
                        } else { // password doesn't match
                            console.log("not a match")
                            // the user's login attempt failed
                            res.status(401).json({message: "invalid credentials"});
                        };
                    });

                } else // if it does not
                {
                    // the user credentials do not exist
                    res.status(400).json({message: "user does not exist"});

                }
            }
        )
    });
    //res.send(userData);
});

// Specify the access controls and functions for the server
app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Go to the home page
app.get('/', function (request, response) { response.write('<H1>Welcome to the Listings Database!</H1>')
    response.write('<p1><a href = http://127.0.0.1:3000/Listings>View All Listings</p1>')
    response.end()
})

// route to 'Listings' page - localhost:3000/Listings
app.get('/Listings', function (request, response) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("listingsDB"); dbo.collection("listings").find().toArray(function(err, listingsArray) {
            if (err) throw err;
            response.write('<H1>Welcome to the MONGO Listings Database!</H1>');
            console.log(listingsArray);
            listingsArray.forEach(function(listing, index)
            {
                let listingsHTML = "<p>Listings " + index + ": <a href = " + listing.Poster + ">" + listing.Title + "</a> is in " + listing.Location + "</p>";
                response.write(listingsHTML); });
            response.end(); db.close();
        });
    });
});

// run server on same port as frontend
app.listen(port);

// notify user of server successfully running
console.log("Web API running at http://127.0.0.1:" + port );
