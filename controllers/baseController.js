const utilities = require('../utilities/');
const baseController = {};

baseController.buildHome = async function (req, res) {
    const nav = await utilities.getNav();
    res.render('partials/index', { title: 'Home', nav });
};

module.exports = baseController;
