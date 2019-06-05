const functions = require('firebase-functions');
// const admin = require('firebase-admin') //import adminsdk
const app = require('express')();
// admin.initializeApp();    //to use admin inital application
//one line import express
// const express = require('express'); //require and init express rewrite routes
// const app = express();
//npm i --save firebase in function folder then initalize it below

//import Auth middleware since it was moved
const FBAuth = require('./util/fbAuth')

//REFACTOR ROUTES
//GET allReacts
const {getAllReacts, postOneReact} = require('./handlers/reacts'); // ref to get route
const {signup, login} =  require('./handlers/users');

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

//USER ROUTES
//SIGNUP route
app.post('/signup', signup); 
//LOGIN route
app.post('/login', login);

//
//  (req, res) => {
//       admin
//       .db()
//       .collection('reacts')
//       .orderBy('createdAt', 'desc') //order by descending timestamp! get latest first
//       .get()//need access to db with admin sdk by importing on top
//       .then(data =>{
//         let reacts = [];
//         data.forEach((doc) => {
//             reacts.push({
//                 reactId: doc.id,
//                 body: doc.data().body,
//                 userHandle: doc.data().userHandle,
//                 createdAt: doc.data().createdAt  //get with get request and api/reacts see update and react obj id
//                 //we got reacts updated in postman now organize by latest using time
//             });
//         });  
//         return res.json(reacts);
//     })
//     .catch((err) => {
//         console.error(err);
//         res.status(500).json({error: err.code});
//     });
// });

    //this will make multiple routes
    //need to tell firebase this is container for all our getroutes
    //run firebase deploy y to deletes!check api route in postman see all 4 users!
    //go to firebase function and see the api request yes!
    //
    //working commit!
// exports.getReacts = functions.https.onRequest((req, res) =>{
//     admin.firestore().collection('reacts').get()//need access to db with admin sdk by importing on top
//     .then(data =>{
//         let reacts = [];
//         data.forEach(doc => {
//             reacts.push(doc.data());
//         });  //promise to get data and store in arr called reacts after forLoop
//         return res.json(reacts);
//     })
//     .catch(err => console.error(err))
// });
//test by copy url endpoint in postman GET route send see reacts from db works commit
//http://localhost:5000/reacttomyreactapp/us-central1/api/reacts


//CREATE ROUTE
//AUTH MIDDLEWARE
// const FBAuth = (req,res,next) => {
//     let idToken;
//     if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
//         idToken = req.headers.authorization.split('Bearer ')[1];
//     }else{
//         console.error('No token found')
//         return res.status(403).json({error: 'Unauthorized'});
//     }
//     admin.auth().verifyIdToken(idToken)
//     .then(decodedToken => {
//         req.user = decodedToken;
//         console.log(decodedToken);
//         return db.collection('users')
//             .where('userId', '==', req.user.uid)
//             .limit(1)
//             .get();
//     })
//     .then(data => {
//         req.user.username = data.docs[0].data().username;
//         return next();
//     })
//     .catch(err => {
//         console.error('Error while verifying token', err);
//         return res.status(403).json(err);
//     })
// }
//add firebase auth


// POST ROUTE post 1 react
//app.post('/react', FBAuth, postOneReact); move to top
// (req, res) => {
//     if(req.body.body.trim() === ''){
//         return res.status(400).json({body: 'Body must not be empty.'});
//     }
//     const newReact = {
//         body: req.body.body, //for postman
//         userHandle: req.user.username,
//         //createdAt: admin.firestore.Timestamp.fromDate(new Date()) get rid of this cuz show nanoseconds write
//         createdAt: new Date().toISOString() //iso is fx will make in string
//         //create dbschema.js
//     };
   
//       db.collection('reacts')
//         .add(newReact)
//         .then((doc) => {
//             res.json({message: `Document ${doc.id} created Sucessfully!`});
//         })
//         .catch(err => {
//             res.status(500).json({error:'Oh no! Something went wrong!'});
//             console.error(err);
//         });
// });
// get url http://localhost:5000/reacttomyreactapp/us-central1/api/react
//create a new react in postman
    //sucess!!! commit!
//exports.createReact = functions.https.onRequest((req, res) => {
    // if(req.method !== 'POST'){
    //     return res.status(400).json({error: 'Method not allowed'}) //this method allows to see error code instead of 404 server error when hitting wrong route
    // }
    // const newReact = {
    //     body: req.body.body, //for postman
    //     userHandle: req.body.userHandle,
    //     createdAt: admin.firestore.Timestamp.fromDate(new Date())
    // };
    // admin.firestore()
    //     .collection('reacts')
    //     .add(newReact)
    //     .then(doc => {
    //         res.json({message: `Document ${doc.id} created Sucessfully!`});
    //     })
    //     .catch(err => {
    //         res.status(500).json({error:'Oh no! Something went wrong!'});
    //         console.error(err);
    //     });
//});
//run firebase serve to test in postman with post req, body json
    //{"body": "New React", "userHandle":"Jae"}
    //check in firebase db, if server error occurs due to route errors
    //works commit!

//now install express npm i --save express import it in


//HELPER METHODS!
// const isEmail = (email) => {
//     const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // from https://pastebin.com/f33g85pd check for validation of emails
//     if(email.match(regEx))
//     return true;
    
// }

// const isEmpty = (string) =>  {
//     if(string.trim() === ''){
//         return true;
//     }else {
//         return false;  
//     }   
// }



//SIGN UP ROUTE
// app.post('/signup', signup);  move to top
// (req, res) => {
//     const newUser = {
//         email: req.body.email,
//         password: req.body.password,
//         confirmPassword: req.body.confirmPassword,
//         username: req.body.username, 
//     };

//     let errors = {};

//     if(isEmpty(newUser.email)){
//         errors.email = 'Must not be empty.'
    // }else if(!isEmail(newUser.email)){
    //     errors.email = 'Must be a valid email address.'
    // }
    
    // if(isEmpty(newUser.password))errors.password = 'Must not be empty.'
    // if(newUser.password !== newUser.confirmPassword) errors.confirmPassword = 'Password must match';
    // if(isEmpty(newUser.username))errors.username = 'Must not be empty.';

    // if(Object.keys(errors).length > 0)
    // return res.status(400).json(errors);


    // //TODO: validate data (firebase stuff)
    // let token, userId;
    // db.doc(`/users/${newUser.username}`)
    // .get() //fx to check if username already exist
    // .then(doc => {
    //     if(doc.exists){
    //         return res.status(400).json({username: 'This username is already taken.'});
    //     }else{
    //         return firebase
    //     .auth()
    //     .createUserWithEmailAndPassword(newUser.email, newUser.password)
    //     }
    // }) //chain promise for access token so user cna request more data
    // .then(data =>{
    //     userId = data.user.uid;
    //     return data.user.getIdToken();
    // })
    // .then(idToken => {
    //     token = idToken;
    //     const userCredentials = {
    //         username: newUser.username,
    //         email: newUser.email,
    //         createdAt: new Date().toISOString(),
    //         userId
    //     };
    //     return db.doc(`/users/${newUser.username}`).set(userCredentials); 
    // })
    // .then (() => {
    //     return res.status(201).json({token}); //delete entire collections check in postman
    // })
    // SHOuld return a token when postman create a new user
        // works see token
        //user already exist see username already exist
    // firebase
    // .auth()
    // .createUserWithEmailAndPassword(newUser.email, newUser.password)
    // .then((data) => {
    //     return res
    //     .status(201)
    //     .json({message: `user ${data.user.uid} signed up sucessfully!`});
    // })
//     .catch(err => {
//         console.error(err);
//         if (err.code == 'auth/email-already-in-use'){
//             return res.status(400).json({email: 'Email is already in use.'}); 
//         }else{
//         return res.status(500).json({error: err.code});
//         }
//     });
// });
//check on postman if created user http://localhost:5000/reacttomyreactapp/us-central1/api/signup
// //{
// 	"email":"user@email.com",
// 	"password": "123",
// 	"confirmPassword": "123",
// 	"username": "Pikachu"
// }
// delete nodepacks and install latest firebase now! =.= ugh
    //pass must be good ish commit!
    //got to firebase authenticaltion see user and id copy uid
    //add to database!

//LOGIN ROUTE
//app.post('/login', login); move route top
// (req,res) => {
//     const user = {
//         email: req.body.email,
//         password: req.body.password
//     };
//     let errors = {};

//     if(isEmpty(user.email)) errors.email = 'Must not be empty.';
//     if(isEmpty(user.password)) errors.password ='Must not be empty.';

//     if (Object.keys(errors).length > 0) 
//     return res.status(400).json(errors);

//     firebase
//         .auth()
//         .signInWithEmailAndPassword(user.email, user.password)
//         .then(data => {
//             return data.user.getIdToken();
//         })
//         .then(token => {
//             return res.json({token});
//         })
//         .catch(err => {
//             console.error(err);
//             if(err.code === 'auth/wrong-password'){
//                 return res
//                 .status(403)
//                 .json({general: 'Wrong password or email, please try again'});
//             } 
//             else return res.status(500).json({error: err.code});
//         });
// });


// export api at bottom! or bad req =.=
//https://baseurl.com/api/ 
exports.api = functions.https.onRequest(app); 