const invModel = require('../models/inventory-model');
const vehicleModel = require('../models/vehicle-model');
const classModel = require('../models/classification-model');
const Util = require('../utilities/');

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(
        classification_id
    );
    const grid = await Util.buildClassificationGrid(data);
    let nav = await Util.getNav();
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

    const grid = await Util.buildByInventoryId(data);
    let nav = await Util.getNav();

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
    let nav = await Util.getNav();
    const classificationSelector = await Util.buildClassificationList();

    res.render('./inventory/management', {
        title: 'Vehicle Management',
        nav,
        classificationSelector,
    });
};

invCont.buildManageClassification = async (req, res, next) => {
    let nav = await Util.getNav();

    res.render('inventory/manageClassification', {
        title: 'Add Classification',
        nav,
    });
};

invCont.buildManageVehicle = async (req, res, next) => {
    let nav = await Util.getNav();

    res.render('./inventory/manageVehicle', {
        title: 'Add Vehicle',
        nav,
    });
};

invCont.buildInventoryManager = async (req, res, next) => {
    const inv_id = req.params.inv_id;

    const data = await invModel.getModelByInventoryId(inv_id);
    let nav = await Util.getNav();

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

    const title = `Edit: ${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`;
    res.render('./inventory/edit-inventory', {
        title: title,
        nav,
    });
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
    const inv_id = req.params.inv_id;
    let data = await invModel.getModelByInventoryId(inv_id);
    data = data[0];
    let nav = await Util.getNav();

    const classificationSelect = await Util.buildClassificationList(
        data.classification_id
    );

    res.render('./inventory/edit-inventory', {
        title: 'Edit: ' + data.inv_make + ' ' + data.inv_model,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
        inv_id: data.inv_id,
        inv_make: data.inv_make,
        inv_model: data.inv_model,
        inv_year: data.inv_year,
        inv_description: data.inv_description,
        inv_image: data.inv_image,
        inv_thumbnail: data.inv_thumbnail,
        inv_price: data.inv_price,
        inv_miles: data.inv_miles,
        inv_color: data.inv_color,
        classification_id: data.classification_id,
    });
};

invCont.registerVehicle = async (req, res) => {
    let status = 200;
    const {
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id,
    } = req.body;

    const regResult = await vehicleModel.addVehicle(
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    );

    if (regResult) {
        req.flash(
            'notice',
            `You\'ve added ${inv_year} ${inv_make} ${inv_model}.`
        );
        status = 201;
    } else {
        req.flash(
            'notice',
            `Sorry, there was an error adding ${inv_year} ${inv_make} ${inv_model}.`
        );
        status = 501;
    }

    res.status(status).redirect('./');
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
    let nav = await Util.getNav();
    const {
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id,
    } = req.body;
    const updateResult = await invModel.updateInventory(
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id
    );

    if (updateResult) {
        const itemName = updateResult.inv_make + ' ' + updateResult.inv_model;
        req.flash('notice', `The ${itemName} was successfully updated.`);
        res.redirect('/inv/');
    } else {
        const classificationSelect = await Util.buildClassificationList(
            classification_id
        );
        const itemName = `${inv_make} ${inv_model}`;
        req.flash('notice', 'Sorry, the insert failed.');
        res.status(501).render('inventory/edit-inventory', {
            title: 'Edit ' + itemName,
            nav,
            classificationSelect: classificationSelect,
            errors: null,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id,
        });
    }
};

invCont.registerClassification = async (req, res) => {
    let nav = await Util.getNav();
    const { classification_name } = req.body;

    const regResult = await classModel.addClassification(classification_name);

    if (regResult) {
        req.flash('notice', `You\'ve added ${classification_name}`);
        res.status(201);
    } else {
        req.flash(
            'notice',
            `Sorry, there was an error adding ${classification_name}.`
        );
        res.status(501);
    }
    res.render('/inv/classification', {
        title: 'Add Classification',
        nav,
    });
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id);
    const invData = await invModel.getInventoryByClassificationId(
        classification_id
    );
    if (invData[0].inv_id) {
        return res.json(invData);
    } else {
        next(new Error('No data returned'));
    }
};

module.exports = invCont;
