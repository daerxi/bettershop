const express = require('express');
const {universalLogin, checkBusinessToken} = require("../controllers/auth");
const {login, createBusiness} = require("../controllers/businesses");
const {Business} = require("../sync");
const {isNullOrEmpty} = require("../common/utils");

const router = express.Router();

router.get('/', checkBusinessToken, function (req, res, next) {
    try {
        Business.findAll().then(async businesses => {
            res.status(200).send(businesses);
        })
    } catch (error) {
        res.status(400).json({error});
    }
});

router.post('/', async (req, res) => {
    try {
        const email = req.body.email.toLowerCase();
        const rawPassword = req.body.password;
        const name = req.body.name;
        if (isNullOrEmpty(email) || isNullOrEmpty(rawPassword) || isNullOrEmpty(name))
            throw "required field cannot be empty";
        else {
            await createBusiness(name, email, rawPassword).then(async business => {
                if (business) {
                    delete business["dataValues"].password;
                    res.status(201).send(business);
                } else res.status(400).json({error: "unknown reason"});
            });
        }
    } catch (error) {
        if (error.errors) res.status(400).json({error: error.errors[0].message});
        else res.status(400).json({error});
    }
});

router.post('/login', async (req, res) => {
    universalLogin(login, req, res);
});

module.exports = router;
