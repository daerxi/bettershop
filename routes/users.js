const express = require('express');
const {checkToken, decodeJWT, deleteToken} = require("../controllers/auth");
const {User} = require("../sync");
const {createUser, login, findUserByUserId} = require("../controllers/users");
const {createBusiness} = require("../controllers/businesses");
const {isNullOrEmpty} = require("../common/utils");
const router = express.Router();

router.get('/', function (req, res, next) {
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
        const isBusiness = req.body.isBusiness;
        if (isNullOrEmpty(email) || isNullOrEmpty(rawPassword) || isNullOrEmpty(firstName) || isNullOrEmpty(lastName))
            throw "Required field cannot be empty.";
        else if (isBusiness && isNullOrEmpty(req.body.name))
            throw "Name is required as a business account.";
        else {
            await createUser(firstName.trim(), lastName.trim(), email.toLowerCase().trim(), rawPassword.trim(), isBusiness).then(async user => {
                if (user) {
                    // business account
                    if (isBusiness) await createBusiness(req.body.name.trim(), user.id);
                    delete user["dataValues"].password;
                    res.status(201).json(user);
                } else res.status(400).json({error: "Unknown reason."});
            });
        }
    } catch (error) {
        if (error.errors) res.status(400).json({error: error.errors[0].message});
        else res.status(400).json({error});
    }
});

router.post('/login', async (req, res) => {
    return await login(req.body.email, req.body.password, res);
});

router.get('/me', checkToken, function (req, res, next) {
    const userId = decodeJWT(req.header.token).sub;
    findUserByUserId(userId).then(user => {
        delete user["dataValues"].password;
        res.status(201).json(user);
    });
});

router.delete('/logout', checkToken, async (req, res) => {
    await deleteToken(req.header.token).then(async () => res.send(204))
            .catch(e => { res.status(400).json({error: e}) });
});

module.exports = router;