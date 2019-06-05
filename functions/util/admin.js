const admin = require('firebase-admin') //import adminsdk

admin.initializeApp();    //to use admin inital application

const db = admin.firestore(); //where we need firestore use db.

//import admin and db
module.exports = {admin, db};