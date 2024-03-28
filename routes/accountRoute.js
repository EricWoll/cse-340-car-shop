// Needed Resources
const express = require('express');
const router = new express.Router();
const accountController = require('../controllers/accountController');
const Util = require('../utilities');
const regValidate = require('../utilities/account-validation');

// Route to build login
router.get(
    '/',
    Util.checkLogin,
    Util.handleErrors(accountController.loginView)
);
router.get('/login', Util.handleErrors(accountController.buildLogin));
router.get('/register', Util.handleErrors(accountController.buildRegister));

router.post(
    '/login',
    regValidate.loginRules(),
    regValidate.checkRegData,
    Util.handleErrors(accountController.accountLogin)
);

router.post(
    '/register',
    regValidate.registationRules(),
    regValidate.checkRegData,
    Util.handleErrors(accountController.registerAccount)
);

module.exports = router;
