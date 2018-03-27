var express = require('express');
const { body, validationResult } = require('express-validator/check');
const createUser = require('../utils/createUser');
const authenticate = require('../middlewares/authenticate');

var router = express.Router();

const passwordLength = 5;

router.post('/',
  [body('email', 'Podaj adres email').isEmail(),
  body('password', 'Hasło musi składać się z conajmniej ' + passwordLength + ' znaków').isLength({ min: passwordLength }),
  body('confirmPassword', 'Hasła muszą być takie same').custom((value, { req }) => value === req.body.password)],
  (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      createUser(email, password)
        .then(user => res.json(user))
        .catch(errors => res.status(403).json({ errors }))
    } else {
      res.status(403).json({ errors: errors.mapped() });
    }

  });

router.get('/', authenticate, (req,res) => {
  const { currentUser } = req;

  res.json({ currentUser });
})

module.exports = router;
