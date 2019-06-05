const {db} =  require('../util/admin');

const config = require('../util/config');

const firebase = require('firebase');
firebase.initializeApp(config)

const {validateSignUpData, validateLoginData} = require('../util/validatorshelper')


exports.signup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        username: req.body.username, 
    };

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
            userId
        };
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

exports.login = (req,res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };

    //add valid fx  by destructuring
    const {valid, errors} = validateLoginData(User);

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