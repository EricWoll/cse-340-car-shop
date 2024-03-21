// Needed Resources
const express = require('express');
const router = new express.Router();
const accountController = require('../controllers/accountController');
const Util = require('../utilities');
const regValidate = require('../utilities/account-validation');

// Route to build login
router.get('/login', Util.handleErrors(accountController.buildLogin));
router.get('/register', Util.handleErrors(accountController.buildRegister));

router.post('/login', (req, res) => {
    res.status(200).send('login process');
});
router.post(
    '/register',
    regValidate.registationRules(),
    regValidate.checkRegData,
    Util.handleErrors(accountController.registerAccount)
);

module.exports = router;
