const invModel = require('../models/inventory-model');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications();
    let list = '<ul>';
    list += '<li class="nav-item" ><a href="/" title="Home page">Home</a></li>';
    data.rows.forEach((row) => {
        list += '<li class="nav-item" >';
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            '</a>';
        list += '</li>';
    });
    list += '</ul>';
    return list;
};

/* **************************************
 * Build the classification list HTML
 * ************************************ */
Util.buildClassificationList = async (req, res, next) => {
    let data = await invModel.getClassifications();
    let selector = `<select name="classificationList" id='classificationList'>`;
    selector += `<option value='selectValue'>--Select Classification--</option>`;
    data.rows.forEach((row) => {
        selector += `<option value=${row.classification_id}>${row.classification_name}</option>`;
    });
    selector += `</select>`;
    return selector;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
    let grid;
    if (data.length > 0) {
        grid = '<ul id="inv-display">';
        data.forEach((vehicle) => {
            grid += '<li>';
            grid +=
                '<a href="../../inv/detail/' +
                vehicle.inv_id +
                '" title="View ' +
                vehicle.inv_make +
                ' ' +
                vehicle.inv_model +
                'details"><img class="inv-item-img" src="' +
                vehicle.inv_thumbnail +
                '" alt="Image of ' +
                vehicle.inv_make +
                ' ' +
                vehicle.inv_model +
                ' on CSE Motors" /></a>';
            grid += '<div class="namePrice">';
            grid += '<h2>';
            grid +=
                '<a href="../../inv/detail/' +
                vehicle.inv_id +
                '" title="View ' +
                vehicle.inv_make +
                ' ' +
                vehicle.inv_model +
                ' details">' +
                vehicle.inv_make +
                ' ' +
                vehicle.inv_model +
                '</a>';
            grid += '</h2>';
            grid +=
                '<span><em>$' +
                new Intl.NumberFormat('en-US').format(vehicle.inv_price) +
                '</em></span>';
            grid += '</div>';
            grid += '</li>';
        });
        grid += '</ul>';
    } else {
        grid +=
            '<p class="notice">Sorry, no matching vehicles could be found.</p>';
    }
    return grid;
};

Util.buildByInventoryId = async (data) => {
    let grid;
    if (data.length > 0) {
        const model = data[0];
        grid = `
        <div id="model-info">
            <img
                id="model-img"
                src="${model.inv_image}"
                alt="Image of ${model.inv_make} ${model.inv_model} on CSE Motors"
                />
            <section id='model-details'>
                <h2>${model.inv_make} ${model.inv_model} Details</h2>
                <p><strong>Price:</strong> $${model.inv_price}</p>
                <p><strong>Description</strong>: ${model.inv_description}</p>
                <p><strong>Color</strong>: ${model.inv_color}</p>
                <p><strong>Miles</strong>: ${model.inv_miles}</p>
            </section>
        </div>
        `;
    } else {
        grid =
            '<p class="notice">Sorry, no matching vehicles could be found.</p>';
    }
    return grid;
};

Util.buildAccountGrid = async (data) => {
    let grid;
    console.log(data)
    if (data.length > 0) {
        grid = '<ul id="accounts-holder" >';
        data.forEach((account) => {
            grid += '<li class="account">';
            grid += `<section class="account-name"><p>${account.account_firstname}</p><p>${account.account_lastname}</p></section>`;
            grid += `<p classs="account-email">${account.account_email}</p>`;
            grid += `<p class="account-type">${account.account_type}</p>`;
            if (account.account_type == 'Admin' || account.account_type == 'Employee') {
                grid += `<form class="acount-updater" action="/account/manage" method="post">`
                grid += `<select name=account_type>`;
                grid += `<option value=${account.account_type}>${account.account_type}</option>`;
                switch (account.account_type) {
                    case 'Admin':
                        grid += `<option value="Employee">Employee</option>`
                        break;
                    case 'Employee':
                        grid += `<option value="Admin">Admin</option>`
                        break;
                }
                grid += `</select>`
                grid += `<input type="hidden" name="account_id" value=${account.account_id}>`
                grid += `<input type="submit" class="form-update" value="Update" />`
                grid += `</form>`

            }
            grid += '</li>'
        });
        grid += '</ul>';
    } else {
        grid = '<p class="notice">Sorry, no Accounts could be found.</p>';
    }
    return grid;
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    req.flash('Please log in');
                    res.clearCookie('jwt');
                    return res.redirect('/account/login');
                }
                res.locals.accountData = accountData;
                res.locals.loggedin = 1;
                next();
            }
        );
    } else {
        next();
    }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        next();
    } else {
        req.flash('notice', 'Please log in.');
        return res.redirect('/account/login');
    }
};

module.exports = Util;
