const express = require('express');
const {sendEmail} = require("../common/utils");

const {checkToken, decodeJWT} = require("../controllers/auth");
const {User} = require("../sync");
const {
    createUser,
    login,
    updateToken,
    findUserByUserId,
    destroyToken,
    updatePassword,
    findUserByEmail,
    updateProfile,
    generateVerificationCode,
    findUserByVerificationCode
} = require("../controllers/users");
const {createBusiness} = require("../controllers/businesses");
const {isNullOrEmpty, deleteSensitiveInfo, getInsensitiveInfo} = require("../common/utils");
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
        const userName = req.body.userName;
        const isBusiness = req.body.isBusiness;
        if (isNullOrEmpty(email) || isNullOrEmpty(rawPassword) || isNullOrEmpty(userName))
            throw "Required field cannot be empty.";
        else if (isBusiness && isNullOrEmpty(req.body.name))
            throw "Name is required as a business account.";
        else {
            await createUser(userName.trim(), email.toLowerCase().trim(), rawPassword.trim(), isBusiness).then(async user => {
                if (user) {
                    // business account
                    if (isBusiness) await createBusiness(req.body.name.trim(), user.id);
                    user = deleteSensitiveInfo(user);
                    await generateVerificationCode(user, res).then(async () => {
                        res.status(201).json(user);
                    });
                } else res.status(400).json({error: "Unknown reason."});
            });
        }
    } catch (error) {
        if (error.errors) res.status(400).json({error: error.errors[0].message});
        else res.status(400).json({error});
    }
});

router.post('/login', async (req, res) => {
    return await login(req.body.email, req.body.password, res).catch(e => {
        res.status(400).json({error: "Bad Request", reason: e.toString()})
    });
});

router.get('/me', checkToken, function (req, res, next) {
    const userId = decodeJWT(req.header.token).sub;
    findUserByUserId(userId).then(user => {
        user = deleteSensitiveInfo(user);
        res.status(201).json(user);
    });
});

router.get('/forgotPassword', async (req, res) => {
    if (!isNullOrEmpty(req.query.email)) {
        const email = req.query.email.toLowerCase()
        await findUserByEmail(email).then(async user => {
            if (user) {
                await generateVerificationCode(user, res).then(async () => {
                    res.status(200).json({success: true});
                });
            } else {
                res.status(404).json({error: "Account does not exist."});
            }
        }).catch(e => {
            console.log(e)
            res.status(400).json({error: "Unknown reason.", reason: e.toString()});
        });
    } else {
        res.status(400).json({error: "Email address is not provided."});
    }

});

router.post('/verify', async (req, res) => {
    const verificationCode = req.body.verificationCode;
    await findUserByVerificationCode(verificationCode).then(async user => {
        await updateProfile(user.id, {
            verificationCode: null,
            active: true
        }).then(async () => {
            await updateToken(user.id, res).catch(e => {
                return res.status(400).json({error: e.toString()});
            });
        }).catch(e => {
            res.status(400).json({error: e.toString()});
        });
    });
});

router.post('/resetPassword', checkToken, async (req, res) => {
    const userId = decodeJWT(req.header.token).sub;
    await updatePassword(userId, req.body.password.trim()).then(async () => {
        res.status(200).json({success: true});
    }).catch(e => {
        res.status(400).json({error: "Update failed.", reason: e.toString()})
    });
});


router.delete('/logout', checkToken, async (req, res) => {
    const userId = decodeJWT(req.header.token).sub;
    await destroyToken(userId).then(async () => res.send(200))
        .catch(e => {
            res.status(400).json({error: e})
        });
});

router.get('/:id', function (req, res, next) {
    findUserByUserId(req.params.id).then(user => {
        if (user) {
            user = getInsensitiveInfo(user);
            res.status(201).json(user);
        } else {
            res.status(404).json({error: "Not found"});
        }
    }).catch(e => {
        res.status(400).json({error: "Bad Request"});
    });
});

module.exports = router;
