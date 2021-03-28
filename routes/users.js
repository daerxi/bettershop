const express = require('express');
const {checkToken, isNullOrEmpty, universalLogin} = require("../common/lib");
const {User} = require("../sync");
const {createUser, login} = require("../common/users");

const router = express.Router();

router.get('/', checkToken, function (req, res, next) {
    try {
        User.findAll().then(async users => {
            res.status(200).send(users);
        })
    } catch (error) {
        res.status(400).json({error});
    }
});

router.post('/', async (req, res) => {
    try {
        const email = req.body.email;
        const rawPassword = req.body.password;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        if (isNullOrEmpty(email) || isNullOrEmpty(rawPassword) || isNullOrEmpty(firstName) || isNullOrEmpty(lastName))
            throw "required field cannot be empty";
        else {
            await createUser(firstName.trim(), lastName.trim(), email.toLowerCase().trim(), rawPassword.trim()).then(async user => {
                if (user) {
                    delete user["dataValues"].password;
                    res.status(201).send(user);
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
