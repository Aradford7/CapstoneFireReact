const functions = require('firebase-functions');
const app = require('express')();
const FBAuth = require('./util/fbAuth')

//REFACTOR ROUTES
//GET allReacts

const {
    getAllReacts, 
    postOneReact,
    getReact,
    commentOnReact} = require('./handlers/reacts'); // ref to get route

const {
    signup, 
    login, 
    uploadImage, 
    addUserDetails, 
    getAuthenticatedUser} =  require('./handlers/users');


//REACT ROUTES
//GET route
app.get('/reacts', getAllReacts);
//POST route
app.post('/react', FBAuth, postOneReact);
//GET 1 react
app.get('/react/:reactId', getReact);
//POST comment on react
app.post('/react/:reactId/comment', FBAuth, commentOnReact);
//TODO: delete react, like a react, unlike a react, 



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