const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // from https://pastebin.com/f33g85pd check for validation of emails
    if(email.match(regEx))
    return true;
    
};

const isEmpty = (string) =>  {
    if(string.trim() === ''){
        return true;
    }else {
        return false;  
    }   
};

//import this to users.js
exports.validateSignUpData = (data) => {
    let errors = {};

    if(isEmpty(data.email)){
        errors.email = 'Must not be empty.'
    }else if(!isEmail(data.email)){
        errors.email = 'Must be a valid email address.'
    }

    if(isEmpty(data.password))errors.password = 'Must not be empty.'
    if(data.password !== data.confirmPassword) errors.confirmPassword = 'Password must match';
    if(isEmpty(data.username))errors.username = 'Must not be empty.';
    //check for errors or if valid before procceding
        return{
            errors,
            valid: Object.keys(errors).length === 0 ? true : false
    }
}

//

exports.validateLoginData = (data) => {
    let errors = {};

    if(isEmpty(user.email)) errors.email = 'Must not be empty.';
    if(isEmpty(user.password)) errors.password ='Must not be empty.';

    if (Object.keys(errors).length > 0) 
    return res.status(400).json(errors);

    return{
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}