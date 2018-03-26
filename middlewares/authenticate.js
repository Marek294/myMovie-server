const jwt = require('jsonwebtoken');

const User = require('../models/User');

module.exports = (req, res, next) => {
    const authorizationHeader = req.headers['AuthorizationToken'];
    let token;

    if(authorizationHeader) token = authorizationHeader.split(' ')[1];

    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err) res.status(401).json({ error: 'Token jest nieprawidłowy'})
            else {
                return User.query({
                    select: ['id', 'email'],
                    where: { email: decoded.email }
                }).fetch().then(user => {
                    if(user) {
                        req.currentUser = user.toJSON();
                        return next();
                    }
                    else return res.status(401).json({ error: 'Brak użytkownika o takim adresie email'});
                })
            }
        })
    } else res.status(401).json({ error: 'Brak tokenu'});
}