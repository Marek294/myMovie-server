const User = require('../models/User');

module.exports = (confirmationToken) => {
    return new Promise((resolve, reject) => { 
        return User.query({
            where: { confirmationToken }
        }).fetch().then(user => {
            if (user) {
                user.set('confirmed', true);
                user.set('confirmationToken', '');
                user.save();
                
                return resolve();
            } else {
                const errors = { global: 'Nieprawidłowy token bądź użytkownik już zatwierdził email' }
                return reject(errors);
            }
        })
    })
}