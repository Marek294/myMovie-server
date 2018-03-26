const bcrypt = require('bcrypt');
const generateJWT = require('./generateJWT');

const User = require('../models/User');

module.exports = (email, password) => {
    return new Promise((resolve, reject) => { 
        return User.query({
            where: { email }
        }).fetch().then(user => {
            if (user && bcrypt.compareSync(password, user.get('password_digest'))) {
                const token = generateJWT(user);

                return resolve({ 
                    email: user.get('email'),
                    confirmed: user.get('confirmed'),
                    avatar: user.get('avatar'),
                    token });
            } else {
                const errors = { global: 'Nieprawidłowy adres email lub hasło' }
                return reject(errors);
            }
        })
    })
}