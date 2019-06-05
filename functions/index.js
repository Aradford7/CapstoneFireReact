const functions = require('firebase-functions');
const app = require('express')();
const FBAuth = require('./util/fbAuth')

//REFACTOR ROUTES
//GET allReacts
<<<<<<< HEAD
const {
    getAllReacts, 
    postOneReact,
    getReact} = require('./handlers/reacts'); // ref to get route
=======

const {getAllReacts, postOneReact} = require('./handlers/reacts'); // ref to get route
>>>>>>> master
const {
    signup, 
    login, 
    uploadImage, 
    addUserDetails, 
    getAuthenticatedUser} =  require('./handlers/users');

//const firebase = require('firebase');
    // const config = {
    //     apiKey: "AIzaSyDNlgU-vShGYd69xVRO5Jvi3bLBkOOgkxQ",
    //     authDomain: "reacttomyreactapp.firebaseapp.com",
    //     databaseURL: "https://reacttomyreactapp.firebaseio.com",
    //     projectId: "reacttomyreactapp",
    //     storageBucket: "reacttomyreactapp.appspot.com",
    //     messagingSenderId: "388845875731",
    //     appId: "1:388845875731:web:d93b7fa3f02f69e7"
    //   };
//firebase.initializeApp(config);

// const db = admin.firestore(); //where we need firestore use db.
 //pass in config stuff from firebase console
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

//1. test firebase serve to see url /check in postman
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello World from Jae!");
// });

//2. create db in firebase 
//3. try to fetch these from db with postman


//REACT ROUTES
//GET route
app.get('/reacts', getAllReacts);
//POST route
app.post('/react', FBAuth, postOneReact);
//GET 1 react
app.get('/react/:reactId', getReact);
//TODO: delete react, like a react, unlike a react, comment on react


//USER ROUTES
//SIGNUP route
app.post('/signup', signup); 
//LOGIN route
app.post('/login', login);
//POST route for images
app.post('/user/image', FBAuth, uploadImage);
//POST route for userData
app.post('/user', FBAuth, addUserDetails);
//GET route for userData
app.get('/user', FBAuth, getAuthenticatedUser);


//API
exports.api = functions.https.onRequest(app); 