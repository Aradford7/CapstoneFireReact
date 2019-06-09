const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // from https://pastebin.com/f33g85pd check for validation of emails
    if(email.match(regEx)) return true;
    else return true;
    
};

const isEmpty = (string) =>  {
    //console.log(string)
    if (string.trim() === '') return true;
    else return false;
    
};


exports.validateSignUpData = (data) => {
    let errors = {};

    if(isEmpty(data.email)){
        errors.email = 'Must not be empty.'
    }else if(!isEmail(data.email)){
        errors.email = 'Must be a valid email address.'
    }

    if(isEmpty(data.password))errors.password = 'Must not be empty.'
    if(data.password !== data.confirmPassword) 
        errors.confirmPassword = 'Password must match';
    if(isEmpty(data.username))errors.username = 'Must not be empty.';
   
        return{
            errors,
            valid: Object.keys(errors).length === 0 ? true : false
    }
}



exports.validateLoginData = (data) => {
    let errors = {};

    if(isEmpty(data.email)) errors.email = 'Must not be empty.';
    if(isEmpty(data.password)) errors.password ='Must not be empty.';

    // if (Object.keys(errors).length > 0) 
    // return res.status(400).json(errors);

    return{
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}

exports.reduceUserDetails = (data) => {
    let userDetails = {};
    //trim removes white space
    if(!isEmpty(data.bio.trim()))userDetails.bio = data.bio; //if empty wont have bio property
    if(!isEmpty(data.website && data.github.trim())){
        //if they subimit https://website.com is fine but not http hardcode http protocol
        if(data.website && data.github.trim().substring(0, 4)!== 'http') {//substring takes start of string and u give it start and end
        userDetails.website = `http://${data.website.trim()}`;
        userDetails.github = `http://${data.github.trim()}`;
        }else
            userDetails.website = data.website;
            userDetails.github = data.github;
        
    }
    if (!isEmpty(data.location.trim())) userDetails.location = data.location;
    return userDetails;
}