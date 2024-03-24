const utilities = require('.');
const { body, validationResult } = require('express-validator');
const vehicleModel = require('../models/vehicle-model');
vehicleValidate = {};

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
vehicleValidate.registationRules = () => {
    return [
        // classification
        body('classification_id')
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .isNumeric()
            .withMessage('Please provide a Vehicle Classification.'), // on error this message is sent.
        //make
        body('inv_make')
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage('Please provide a Vehicle Make.'), // on error this message is sent.
        // model
        body('inv_model')
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage('Please provide a Vehicle Model.'), // on error this message is sent.
        //description
        body('inv_description')
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage('Please provide a Vehicle Description.'), // on error this message is sent.
        // image path
        body('inv_image')
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage('Please provide a Vehicle Image.'), // on error this message is sent.
        // thumbnail path
        body('inv_thumbnail')
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage('Please provide a Vehicle Thumbnail.'), // on error this message is sent.
        // price
        body('inv_thumbnail')
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .isNumeric()
            .withMessage('Please provide a Vehicle Thumbnail.'), // on error this message is sent.
        // year
        body('inv_year')
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .isNumeric()
            .withMessage('Please provide a Vehicle Year.'), // on error this message is sent.
        // miles
        body('inv_miles')
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .isNumeric()
            .withMessage('Please provide Vehicle Miles.'), // on error this message is sent.
        // color
        body('inv_color')
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage('Please provide a Vehicle Color.'), // on error this message is sent.
    ];
};

/* ******************************
 * Check data and return errors or continue to classification_name
 * ***************************** */
vehicleValidate.checkRegData = async (req, res, next) => {
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
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render('inv/vehicle', {
            errors,
            title: 'Vehicle',
            nav,
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
        return;
    }
    next();
};

module.exports = vehicleValidate;
