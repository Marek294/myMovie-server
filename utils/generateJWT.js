const jwt = require('jsonwebtoken');

module.exports = function(user) {
    return jwt.sign({
        email: user.get('email'),
        confirmed: user.get('confirmed'),
        avatar: user.get('avatar')
    }, process.env.JWT_SECRET );
}