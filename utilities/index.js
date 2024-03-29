const invModel = require('../models/inventory-model');
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

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
