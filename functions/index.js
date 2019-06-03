//Write in node6
const functions = require('firebase-functions');
const admin = require('firebase-admin') //import adminsdk
admin.initializeApp();    //to use admin inital application
const express = require('express'); //require and init express rewrite routes
const app = express();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

//1. test firebase serve to see url /check in postman
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello World from Jae!");
// });

//2. create db in firebase 
//3. try to fetch these from db with postman
//GET ROUTE
app.get('/reacts', (req, res) => {
      admin.
      firestore()
      .collection('reacts')
      .orderBy('createdAt', 'desc') //order by descending timestamp! get latest first
      .get()//need access to db with admin sdk by importing on top
      .then(data =>{
        let reacts = [];
        data.forEach((doc) => {
            reacts.push({
                reactId: doc.id,
                body: doc.data().body,
                userHandle: doc.data().userHandle,
                createdAt: doc.data().createdAt  //get with get request and api/screams see update and scream obj id
                //we got reacts updated in postman now organize by latest using time
            });
        });  
        return res.json(reacts);
    })
    .catch(err => console.error(err));
});

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
app.post('/react', (req, res) => {
    const newReact = {
        body: req.body.body, //for postman
        userHandle: req.body.userHandle,
        //createdAt: admin.firestore.Timestamp.fromDate(new Date()) get rid of this cuz show nanoseconds write
        createdAt: new Date().toISOString() //iso is fx will make in string
        //create dbschema.js
    };
    admin.firestore()
        .collection('reacts')
        .add(newReact)
        .then((doc) => {
            res.json({message: `Document ${doc.id} created Sucessfully!`});
        })
        .catch(err => {
            res.status(500).json({error:'Oh no! Something went wrong!'});
            console.error(err);
        });
});
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

// export api at bottom! or bad req =.=
//https://baseurl.com/api/ 
exports.api = functions.https.onRequest(app); 