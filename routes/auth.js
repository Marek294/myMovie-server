var express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator/check');
const generateJWT = require('../utils/generateJWT');
const generateResetPasswordJWT = require('../utils/generateResetPasswordJWT');
const AuthenticateUser = require('../utils/authenticateUser');
const ConfirmUser = require('../utils/confirmUser');
const { sendConfirmationEmail, sendResetPasswordEmail } = require('../utils/mailer');
const authenticate = require('../middlewares/authenticate');
const User = require('../models/User');

var router = express.Router();

router.post('/',
  [ body('email', 'Podaj adres email').isEmail(),
    body('password', 'Podaj hasło').exists(),],
  (req, res, next) => {
    const { email, password } = req.body;
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      AuthenticateUser(email,password)
        .then(user => res.json(user))
        .catch(errors => res.status(401).json({ errors }))
    } else {
      res.status(403).json({ errors: errors.mapped() });
    }
  });

router.post('/confirmation', 
  [body('confirmationToken', 'Brak tokenu').exists()],
  (req,res) => {
    const { confirmationToken } = req.body;
    const errors = validationResult(req);

    if(errors.isEmpty()) {
      ConfirmUser(confirmationToken)
        .then(() => res.json({ status: 'Email zatwierdzony' }))
        .catch(errors => res.status(403).json({ errors }))
    } else {
        res.status(403).json({ errors: errors.mapped() });
    }
})

router.post('/sendConfirmationEmail', authenticate, (req, res) => {
  const { email } = req.currentUser;
  return User.query({
      where: { email },
      andWhere: { confirmed: false }
  }).fetch().then(user => {
      if(user) {
          const confirmationToken = generateJWT(user);
          
          user.set('confirmationToken', confirmationToken);
          user.set('confirmed', false);
          user.save();

          sendConfirmationEmail(user);

          return res.json({ status: 'Email wysłany' });
      } else return res.status(403).json({ errors: { global: 'Adres email został już zweryfikowany, bądź nie istnieje' } });
  })
})

router.post('/resetPasswordRequest',
    [body('email', 'Podaj adres email').isEmail()],
    (req, res) => {
        const { email } = req.body;
        const errors = validationResult(req);

        if(errors.isEmpty()) {
            return User.query({
                where: { email }
            }).fetch().then(user => {
                if(user) {
                    const resetPasswordToken = generateResetPasswordJWT(user);
                    
                    user.set('resetPasswordToken', resetPasswordToken);

                    sendResetPasswordEmail(user);

                    return res.json({ status: "Email został wysłany" });
                } else return res.status(400).json({ errors: { global: 'Adres email nie istnieje' } });
            })
        } else {
            res.status(403).json({ errors: errors.mapped() });
        }
})

router.post('/resetPassword',
    [body('token', 'Brak tokenu').exists(),
    body('password', 'Brak nowego hasła').exists()],
    (req ,res) => {
        const { password, token } = req.body;
        const errors = validationResult(req);

        if(errors.isEmpty()) {
            jwt.verify(token, process.env.JWT_SECRET, (err,decoded) => {
                if(err) {
                    res.status(401).json({ errors: { global: "Zły token bądź sesja wygasła" }})
                } else {
                    return User.query({
                        where: { email: decoded.email}
                    }).fetch().then(user => {
                        if(user) {
                            const password_digest = bcrypt.hashSync(password,10);

                            user.set('password_digest', password_digest);
                            return user.save().then(() => res.json({ status: "Poprawnie zmieniono hasło"}));

                        } else return res.status(403).json({ errors: { global: 'Użytkownik nie istnieje' } });
                    })
                }
            });
        } else {
            res.status(403).json({ errors: errors.mapped() });
        }
})

module.exports = router;