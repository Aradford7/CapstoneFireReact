const functions = require('firebase-functions');
const app = require('express')();
const FBAuth = require('./util/fbAuth')

// const cors = require('cors');
// app.use(cors());

const {db} = require('./util/admin')
//REFACTOR ROUTES
//GET allReacts

const {
    getAllReacts, 
    postOneReact,
    getReact,
    deleteReact,
    commentOnReact,
    likeReact,
    unlikeReact} = require('./handlers/reacts'); // ref to get route

const {
    signup, 
    login, 
    uploadImage, 
    addUserDetails, 
    getAuthenticatedUser,
    getUserDetails,
    markNotificationsRead
} =  require('./handlers/users');


//REACT ROUTES
//GET route
app.get('/reacts', getAllReacts);
//POST route
app.post('/react', FBAuth, postOneReact);
//GET 1 react
app.get('/react/:reactId', getReact);
//DELETE route react
app.delete('/react/:reactId', FBAuth, deleteReact);
//POST comment on react
app.post('/react/:reactId/comment', FBAuth, commentOnReact);
//GET route for likes/unlikes
app.get('/react/:reactId/like', FBAuth, likeReact);
app.get('/react/:reactId/unlike', FBAuth, unlikeReact);




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
//GET userDetails
app.get('/user/:username', getUserDetails);
app.post('/notifications', FBAuth, markNotificationsRead);


//API
exports.api = functions.https.onRequest(app); 



//create a notification when like a react
exports.createNotificationOnLike = functions.firestore.document('likes/{id}')
    .onCreate((snapshot) => {
        return db
         .doc(`/reacts/${snapshot.data().reactId}`).get()
         //snapshot is a of this liked doc been created
         .then(doc => {
             if(doc.exists){
                 return db.doc(`/notifications/${snapshot.id}`).set({
                     reactId: doc.id,
                     createdAt: new Date().toISOString(),
                     recipient: doc.data().userHandle,
                     sender: snapshot.data().userHandle,
                     type: 'like',
                     read: false,
                 });
             }
         })
         .then(() => {
             return;
         })
         .catch(err => {
             console.error(err, 'notification didnt create');
             return;
         })
    }) 

//delete notification
exports.deleteNotificationOnUnLike = functions.firestore.document(`likes/{id}`)
    .onDelete((snapshot) => {
        return db
            .doc(`/notifications/${snapshot.id}`)
            .delete()
      .catch((err) =>{
          console.error(err);
          return;
      })
})

// //create Notification on comment
exports.createNotificationOnComment = functions.firestore.document(`comments/{id}`)
    .onCreate((snapshot) => {
        return db
         .doc(`/reacts/${snapshot.data().reactId}`)
         .get() //snapshot is a of this liked doc been created
         .then(doc => {
             if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle){
                 return db.doc(`/notifications/${snapshot.id}`).set({
                     reactId: doc.id,
                     createdAt: new Date().toISOString(),
                     recipient: doc.data().userHandle,
                     sender: snapshot.data().userHandle,
                     type: 'comment',
                     read: false,
                 });
             }
         })
         .catch(err => {
             console.error(err, 'notification didnt create');
             return;
         })
    });


    //notications on like and comment, need to do unlike post delete notification.
