const functions = require('firebase-functions');
const admin = require('firebase-admin') //import adminsdk
admin.initializeApp();    //to use admin inital application
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
//1. test firebase serve to see url /check in postman
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello World from Jae!");
});
//2. create db in firebase 
//3. try to fetch these from db with postman
//GET ROUTE
exports.getReacts = functions.https.onRequest((req, res) =>{
    admin.firestore().collection('reacts').get()//need access to db with admin sdk by importing on top
    .then(data =>{
        let reacts = [];
        data.forEach(doc => {
            reacts.push(doc.data());
        });  //promise to get data and store in arr called reacts after forLoop
        return res.json(reacts);
    })
    .catch(err => console.error(err))
});
//test by copy url endpoint in postman GET route send see reacts from db works commit

//CREATE ROUTE
exports.createReact = functions.https.onRequest((req, res) => {
    const newReact = {
        body: req.body.body, //for postman
        userHandle: req.body.userHandle,
        createdAt: admin.firestore.Timestamp.fromDate(new Date())
    };
    admin.firestore()
        .collection('reacts')
        .add(newReact)
        .then(doc => {
            res.json({message: `Document ${doc.id} created Sucessfully!`});
        })
        .catch(err => {
            res.status(500).json({error:'Oh no! Something went wrong!'});
            console.error(err);
        });
});
//run firebase serve to test in postman with post req, body json
    //{"body": "New React", "userHandle":"Jae"}
    //check in firebase db, if server error occurs due to route errors
    //works commit!