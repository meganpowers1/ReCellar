const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
// required libraries for Express
var express = require('express');
var app = express()
var port = 3000;
// required library for MongoDB
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/";
const crypto = require("crypto");

const register = (req, res, next) => {
    let userData = {
        userid: crypto.randomBytes(16).toString("hex"),
        username: req.body.username,
        email: req.body.password,
        password: req.body.password
    }

    console.log(userData.username);

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("listingsDB");
        dbo.collection("users").insertOne(userData, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });
}

const reg = (request, response, next) => {
    response.write('<H1>Welcome to the Listings Database!</H1>')
    response.write('<p1><a href = http://127.0.0.1:3000/Listings>View All Listings</p1>')
    response.end()
}

/**

 const signup2 = (req, res, next) => {
    // checks if email already exists
    User.findOne({ where : {
            email: req.body.email,
        }})
        .then(dbUser => {
            if (dbUser) {
                return res.status(409).json({message: "email already exists"});
            } else if (req.body.email && req.body.password) {
                // password hash
                bcrypt.hash(req.body.password, 12, (err, passwordHash) => {
                    if (err) {
                        return res.status(500).json({message: "couldnt hash the password"});
                    } else if (passwordHash) {
                        return User.create(({
                            email: req.body.email,
                            name: req.body.name,
                            password: passwordHash,
                        }))
                            .then(() => {
                                res.status(200).json({message: "user created"});
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(502).json({message: "error while creating the user"});
                            });
                    };
                });
            } else if (!req.body.password) {
                return res.status(400).json({message: "password not provided"});
            } else if (!req.body.email) {
                return res.status(400).json({message: "email not provided"});
            };
        })
        .catch(err => {
            console.log('error', err);
        });
};

 const login = (req, res, next) => {
    // checks if email exists
    User.findOne({ where : {
            email: req.body.email,
        }})
        .then(dbUser => {
            if (!dbUser) {
                return res.status(404).json({message: "user not found"});
            } else {
                // password hash
                bcrypt.compare(req.body.password, dbUser.password, (err, compareRes) => {
                    if (err) { // error while comparing
                        res.status(502).json({message: "error while checking user password"});
                    } else if (compareRes) { // password match
                        const token = jwt.sign({ email: req.body.email }, 'secret', { expiresIn: '1h' });
                        res.status(200).json({message: "user logged in", "token": token});
                    } else { // password doesnt match
                        res.status(401).json({message: "invalid credentials"});
                    };
                });
            };
        })
        .catch(err => {
            console.log('error', err);
        });
};

 const isAuth = (req, res, next) => {
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
};

 export { signup, login, isAuth };

 */

module.exports = { register, reg };
