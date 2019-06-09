const functions = require('firebase-functions');
const app = require('express')();
const FBAuth = require('./util/fbAuth')

const cors = require('cors');
app.use(cors());

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
         .then((doc) => {
             if(doc.exists && 
                doc.data().userHandle !== snapshot.data().userHandle){
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
    


//change all the image on every react when user change profile pic
exports.onUserImageChange = functions
    .firestore.document('/users/{userId}')
    .onUpdate((change) =>  {
        console.log(change.before.data());
        console.log(change.after.data());
        if(change.before.data().imageUrl !== change.after.data().imageUrl){
            console.log('image has changed');
            let batch = db.batch();
            return db
                .collection('reacts')
                .where('userHandle', '==', change.before.data().username)
                .get()
                .then((data) => {
                    data.forEach((doc) => {
                        const react = db.doc(`/reacts/${doc.id}`);
                        batch.update(react, {userImage: change.after.data().imageUrl});
                    })
                    return batch.commit();
                });
            }
    });

exports.onReactDelete = functions.firestore.document('/users/{userId}')
    .onDelete((snapshot, context) => {
        const reactId = context.params.reactId; //context in the url
        const batch = db.batch();
        return db.collection('comments').where('reactId', '==', reactId).get()
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/comments/${doc.id}`));
                })
                return db.collection('likes').where('reactId', '==', reactId).get();
            })
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/likes/${doc.id}`));
                })
                return db.collection('notifications').where('reactId', '==', reactId).get();
            })
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/notifications/${doc.id}`));
                })
                return batch.commit();
            })
            .catch(err => console.error(err));
    })

    //change has two properties, need batch to change multiple files 
    //need to deploy cuz fb triggers
        //triggers can change stuff in db and it trigger db



//POSTMAN SAVE
//https://firestore.googleapis.com/v1/projects/reacttomyreactapp/databases/(default)/documents/users