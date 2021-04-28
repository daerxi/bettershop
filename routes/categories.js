const express = require('express');
const {Category} = require("../sync");
const router = express.Router();

router.get('/', async function(req, res, next) {
    Category.findAll().then(categories => {
        res.status(200).json(categories);
    }).catch(error => {
        res.status(400).json({error});
    })
});

module.exports = router;
