var express = require('express');
const { body, validationResult } = require('express-validator/check');
const createUser = require('../utils/createUser');
const authenticate = require('../middlewares/authenticate');

var router = express.Router();

const passwordLength = 5;

router.post('/',
  [body('email', 'Podaj adres email').isEmail(),
  body('password', 'Hasło musi składać się z conajmniej ' + passwordLength + ' znaków').isLength({ min: passwordLength })],
  (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      createUser(email, password)
        .then(token => res.json({ token }))
        .catch(errors => res.status(403).json({ errors }))
    } else {
      res.status(403).json({ errors: errors.mapped() });
    }

  });

router.get('/', authenticate, (req,res) => {
  const { currentUser } = req;

  res.json({ currentUser });
})

router.get('/test', (req,res) => {

  res.json({ test: 'test' });
})

module.exports = router;
