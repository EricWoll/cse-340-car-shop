const invModel = require('../models/inventory-model');
const utilities = require('../utilities/');

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(
        classification_id
    );
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render('./inventory/classification', {
        title: className + ' vehicles',
        nav,
        grid,
    });
};

invCont.buildByInventoryId = async (req, res, next) => {
    const inv_id = req.params.inv_id;
    const data = await invModel.getModelByInventoryId(inv_id);

    const grid = await utilities.buildByInventoryId(data);
    let nav = await utilities.getNav();

    // error check
    if (data.length <= 0) {
        const message = 'Sorry, we appear to have lost that page.';
        res.render('./inventory/error', {
            title: '404',
            nav,
            message,
        });
        return;
    }

    const title = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`;
    res.render('./inventory/model', {
        title: title,
        nav,
        grid,
    });
};

invCont.buildManagement = async (req, res, next) => {
    let nav = await utilities.getNav();

    res.render('./inventory/management', {
        title: 'Vehicle Management',
        nav,
    });
};

invCont.buildManageClassification = async (req, res, next) => {
    let nav = await utilities.getNav();

    res.render('./inventory/manageClassification', {
        title: 'Add Classification',
        nav,
    });
};

invCont.buildManageVehicle = async (req, res, next) => {
    let nav = await utilities.getNav();

    res.render('./inventory/manageVehicle', {
        title: 'Add Vehicle',
        nav,
    });
};

module.exports = invCont;
