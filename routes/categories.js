const express = require('express');
const {Category} = require("../sync");
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    try {
        Category.findAll().then(async categories => {
            res.status(200).send(categories);
        })
    } catch (error) {
        res.status(400).json({error});
    }
});

router.post('/:type', function(req, res, next) {

});

module.exports = router;
