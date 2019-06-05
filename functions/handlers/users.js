const {db, admin} =  require('../util/admin');

const config = require('../util/config');

const firebase = require('firebase');
firebase.initializeApp(config)

const {validateSignUpData, validateLoginData, reduceUserDetails} = require('../util/validatorshelper')


//sign up for user
exports.signup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        username: req.body.username, 
    }

    // let errors = {};

    // if(isEmpty(newUser.email)){
    //     errors.email = 'Must not be empty.'
    // }else if(!isEmail(newUser.email)){
    //     errors.email = 'Must be a valid email address.'
    // }
    
    // if(isEmpty(newUser.password))errors.password = 'Must not be empty.'
    // if(newUser.password !== newUser.confirmPassword) errors.confirmPassword = 'Password must match';
    // if(isEmpty(newUser.username))errors.username = 'Must not be empty.';

    // if(Object.keys(errors).length > 0)
    // return res.status(400).json(errors);

    //add valid fx  by destructuring
    const {valid, errors} = validateSignUpData(newUser);

    if (!valid) return res.status(400).json(errors); //conditional checking if valid

    const noImg = 'no-img.png'

    let token, userId;
    db.doc(`/users/${newUser.username}`)
    .get() //fx to check if username already exist
    .then(doc => {
        if(doc.exists){
            return res.status(400).json({username: 'This username is already taken.'});
        }else{
            return firebase
        .auth()
        .createUserWithEmailAndPassword(newUser.email, newUser.password)
        }
    }) //chain promise for access token so user cna request more data
    .then(data =>{
        userId = data.user.uid;
        return data.user.getIdToken();
    })
    .then(idToken => {
        token = idToken;
        const userCredentials = {
            username: newUser.username,
            email: newUser.email,
            createdAt: new Date().toISOString(),
            imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
            userId
        }
        return db.doc(`/users/${newUser.username}`).set(userCredentials); 
    })
    .then (() => {
        return res.status(201).json({token}); //delete entire collections check in postman
    })
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
    .catch(err => {
        console.error(err);
        if (err.code == 'auth/email-already-in-use'){
            return res.status(400).json({email: 'Email is already in use.'}); 
        }else{
        return res.status(500).json({error: err.code});
        }
    });
}

//Login for user
exports.login = (req,res) => {
    const user = {
        //username: req.body.username,
        email: req.body.email,
        password: req.body.password
    };

    //add valid fx  by destructuring
    const {valid, errors} = validateLoginData(user);

    if (!valid) return res.status(400).json(errors); //conditional checking if valid

    // let errors = {};

    // if(isEmpty(user.email)) errors.email = 'Must not be empty.';
    // if(isEmpty(user.password)) errors.password ='Must not be empty.';

    // if (Object.keys(errors).length > 0) 
    // return res.status(400).json(errors);

    firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then(data => {
            return data.user.getIdToken();
        })
        .then(token => {
            return res.json({token});
        })
        .catch(err => {
            console.error(err);
            if(err.code === 'auth/wrong-password'){
                return res
                .status(403)
                .json({general: 'Wrong password or email, please try again'});
            } 
            else return res.status(500).json({error: err.code});
        });
}



//Add userDetails fx (bio,location,website,github,username,email)
exports.addUserDetails = (req, res) => {
    let userDetails = reduceUserDetails(req.body);

    //look for doc of userdetails
    db.doc(`/users/${req.user.username}`).update(userDetails)
      .then(() => {
          return res.json({message: 'Details added sucessfully'});
      })
      .catch(err => {
          console.error(err);
          return res.status(500).json({error: err.code}) //'Details Did Not get added'
      })
}


//Upload a profile image for user
//import npm i --save busboy for avatar upload img
exports.uploadImage = (req,res) => {
    const BusBoy = require('busboy');
    const path = require('path');
    const os =  require('os');
    const fs = require('fs');


    const busboy = new BusBoy({headers:req.headers}); //need all the callbacks mainly file encoding mimetype

    let imageToBeUploaded = {};
    let imageFileName;

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        console.log(fieldname, filename, encoding,mimetype);
        //extract by getting the extention jpeg or png
        if (mimetype !== 'image/jpeg' && mimetype !== 'image/png'){
            return res.status(400).json({error: 'Wrong file type. Try a different type.'})
        }
        const imageExtension = filename.split('.')[filename.split('.').length -1]; //-1 for last file index
        imageFileName = `${Math.round(Math.random()*100000000000) }.${imageExtension}`;
        const filepath = path.join(os.tmpdir(), imageFileName); //tmpdir is cloud function temporary directory
        imageToBeUploaded = {filepath, mimetype};
        file.pipe(fs.createWriteStream(filepath));
    });
    busboy.on('finish', () => {
        admin
            .storage()
            .bucket()
            .upload(imageToBeUploaded.filepath, {
            resumeable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        })
        .then(() => {
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
            return db.doc(`/users/${req.user.username}`).update({imageUrl}); //imageUrl = field:val
        })
        .then(() => {
            return res.json({message: 'Image uploaded successfully'});
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: 'Something went wrong. Uploading image has failed.'});
        })
    });
    busboy.end(req.rawBody);
}; // image is stored to firebase via config script fb gives, need alt=media so u can see pic instead of it being downloaded to pc
    //add to user db, will need key val imgUrl

//TODO add default blank avatar pic, manual upload fb storage, activate storage, upload file, call it no-img.png

