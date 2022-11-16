
<!-- ABOUT  -->
## About

https://www.youtube.com/watch?v=bM0J1MseOfg

<!-- INSTRUCTIONS -->
## Instructions for Running

* This project has a React Native frontend, stored in the 'Mobile' folder, and a Node.js/Express backend, stored in the 'Server' folder
* In order to correctly run the project, both the frontend and backend need to be active
* First, open a Terminal window and navigate to Mobile - cd mobile
* In Mobile, run npm start 
* If using an emulator (e.g. Android Studio), open a new Terminal window and run react-native run-android
* Open a new Terminal window and navigate to Server - cd server
* In the server, run node app 

## Credentials

* The backend data storage is based on MongoDB. There have been some default accounts created.
* A default account is username: f and password: f
* Additional accounts can be created on the Signup page if needed
* The MongoDB database is locally hosted, and I used my computer's IP address to connect the frontend and backend. If running on a local computer, either use ngrox or your own IP address in the fetch calls wherever mine is (192.168.1.71:5000)

## Other

* Ensure that there is enough storage if running this project on an emulator. The emulator used for testing had ca. 8 GB
* The version of Node used must be >= Version 12 and <= Version 16
* Mongodb had to be run on my computer through a relative file path, as it is on the Mac Catalina OS, which prevents direct editing of the FS
* mongod --dbpath=/Users/[username]/downloads/mongodb/data/db
* This project has Expo dependencies. registerRootComponent and GestureHandlerRootView in mobile/App.js and mobile/index.js are important for the app to run properly
