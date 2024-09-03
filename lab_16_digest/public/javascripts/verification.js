const users = require('../../static/users.json');


const getCredential = (user)=>{
    return users.find((e) => {
        return e.user.toUpperCase() === user.toUpperCase();
    });
}

const verPassword = (pass1, pass2)=>{
    return pass1 === pass2;
}

module.exports = {
    getCredential : getCredential,
    verPassword : verPassword
}