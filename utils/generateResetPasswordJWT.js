const jwt = require('jsonwebtoken');

module.exports = (user) => {
    return jwt.sign({
        email: user.get('email')
    }, process.env.JWT_SECRET,
    { expiresIn: "1h" } );
}