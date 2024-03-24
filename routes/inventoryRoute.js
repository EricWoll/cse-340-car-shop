// Needed Resources
const express = require('express');
const router = new express.Router();
const invController = require('../controllers/invController');
const Util = require('../utilities');
const classRegVal = require('../utilities/classification-validation');
const vehicleRegVal = require('../utilities/vehicle-validation');

router.get('/', Util.handleErrors(invController.buildManagement));
router.get('/vehicle', Util.handleErrors(invController.buildManageVehicle));
router.get(
    '/classification',
    Util.handleErrors(invController.buildManageClassification)
);

router.get(
    '/type/:classificationId',
    Util.handleErrors(invController.buildByClassificationId)
);
router.get(
    '/detail/:inv_id',
    Util.handleErrors(invController.buildByInventoryId)
);

router.post(
    '/vehicle',
    vehicleRegVal.registationRules(),
    vehicleRegVal.checkRegData,
    Util.handleErrors(invController.buildManageVehicle)
);
router.post(
    '/classification',
    classRegVal.registationRules(),
    classRegVal.checkRegData,
    Util.handleErrors(invController.buildManageClassification)
);

module.exports = router;
