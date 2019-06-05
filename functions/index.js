const functions = require('firebase-functions');
const app = require('express')();
const FBAuth = require('./util/fbAuth')

//REFACTOR ROUTES
//GET allReacts
const {getAllReacts, postOneReact} = require('./handlers/reacts'); // ref to react route
const {signup, login} =  require('./handlers/users'); //ref to user routes

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

//API
exports.api = functions.https.onRequest(app); 