const utilities = require('.');
const { body, validationResult } = require('express-validator');
const classificationModel = require('../models/classification-model');
classValidate = {};

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
classValidate.registationRules = () => {
    console.log('validate');
    return [
        // firstname is required and must be string
        body('classification_name')
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage('Please provide a Classification.')
            .custom(async (classification_name) => {
                const classificationExists =
                    await classificationModel.checkExistingClassification(
                        classification_name
                    );
                if (classificationExists) {
                    throw new Error(
                        'Classification exists. Please add a different Classification.'
                    );
                }
            }), // on error this message is sent.
    ];
};

/* ******************************
 * Check data and return errors or continue to classification_name
 * ***************************** */
classValidate.checkRegData = async (req, res, next) => {
    const { classification_name } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render('inv/classification', {
            errors,
            title: 'Classification',
            nav,
            classification_name,
        });
        return;
    }
    next();
};

module.exports = classValidate;
