const users = require('../../static/users.json');


const getCredential = (username, password)=> {
    console.log(users)
    return users.some(user => user.user === username && user.password === password);
}

module.exports = {
    getCredential : getCredential,
}