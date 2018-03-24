const bcrypt = require('bcrypt');
const generateJWT = require('./generateJWT');
const { sendConfirmationEmail } = require('../utils/mailer');

const User = require('../models/User');

module.exports = (email, password) => {
    const password_digest = bcrypt.hashSync(password,10);

    return new Promise((resolve, reject) => { User.forge({ email, password_digest },{ hasTimestamps: true }).save()
            .then(user => {
                user.set('confirmed', false);
                
                const token = generateJWT(user);

                const confirmationToken = generateJWT(user);

                user.set('confirmationToken', confirmationToken);
                user.save();

                sendConfirmationEmail(user);

                return resolve(token);
            })
            .catch(err => {
                var errrors = {};
                if(err.constraint === 'users_email_unique') errors = { global: "Istnieje już użytkownik o takim adresie email" };
                else errors = err;
                console.log(err);
                reject(errors);
            })
        })
}