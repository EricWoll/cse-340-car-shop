const utilities = require('../utilities/');
const accountModel = require('../models/account-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Util = require('../utilities/');
require('dotenv').config();

const accountController = {};

accountController.buildLogin = async (req, res, next) => {
    const nav = await utilities.getNav();
    res.render('account/login', { title: 'Login', nav, errors: null });
};

accountController.buildRegister = async (req, res, next) => {
    const nav = await utilities.getNav();
    res.render('account/register', { title: 'Register', nav, errors: null });
};

accountController.loginView = async (req, res, next) => {
    const nav = await utilities.getNav();
    res.render('account/loginView', { title: 'Logged In', nav, errors: null });
};

accountController.buildManageAccounts = async (req, res, next) => {
    const nav = await Util.getNav();
    const data = await accountModel.getAllAcounts();
    
    const accountGrid = await Util.buildAccountGrid(data);
    res.render('account/manageAccounts', {title: 'Manage Accounts', nav, accountGrid, errors: null})
}

accountController.updateAccount = async (req, res) => {
    const {account_id, account_type} = req.body;
    console.log(account_id, account_type)
    const updateResult = await accountModel.updateAccountType(account_id, account_type);

    if (updateResult) {
        req.flash(
            'notice',
            `Account Updated.`
        );
        res.status(201).redirect('/account/manage');
    } else {
        req.flash('notice', 'Sorry, the Account Update failed.');
        res.status(501).redirect('/account/manage');
    }
}

/* ****************************************
 *  Process Registration
 * *************************************** */
accountController.registerAccount = async (req, res) => {
    const {
        account_firstname,
        account_lastname,
        account_email,
        account_password,
    } = req.body;

    // Hash the password before storing
    let hashedPassword;
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10);
    } catch (error) {
        req.flash(
            'notice',
            'Sorry, there was an error processing the registration.'
        );
        res.status(500).redirect('/account/register');
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    );

    if (regResult) {
        req.flash(
            'notice',
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        );
        res.status(201).redirect('/account/login');
    } else {
        req.flash('notice', 'Sorry, the registration failed.');
        res.status(501).redirect('/account/register');
    }
};

/* ****************************************
 *  Process login request
 * ************************************ */
accountController.accountLogin = async (req, res) => {
    let nav = await Util.getNav();
    const { account_email, account_password } = req.body;
    const accountData = await accountModel.getAccountByEmail(account_email);
    if (!accountData) {
        req.flash('notice', 'Please check your credentials and try again.');
        res.status(400).render('account/login', {
            title: 'Login',
            nav,
            errors: null,
            account_email,
        });
        return;
    }
    try {
        if (
            await bcrypt.compare(account_password, accountData.account_password)
        ) {
            delete accountData.account_password;
            const accessToken = jwt.sign(
                accountData,
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: 3600 }
            );
            if (process.env.NODE_ENV === 'development') {
                res.cookie('jwt', accessToken, {
                    httpOnly: true,
                    maxAge: 3600 * 1000,
                });
            } else {
                res.cookie('jwt', accessToken, {
                    httpOnly: true,
                    secure: true,
                    maxAge: 3600 * 1000,
                });
            }
            return res.redirect('/account/');
        }
    } catch (error) {
        return new Error('Access Forbidden');
    }
};

module.exports = accountController;
