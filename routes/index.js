const express = require('express');
const {Op} = require("sequelize");
const {updateBusiness, getBusiness, getBusinessById} = require("../controllers/businesses");
const {decodeJWT, checkToken} = require("../controllers/auth");
const {Business, Review} = require("../sync");
const router = express.Router();

router.get('/', async function (req, res, next) {
    try {
        await Business.findAll().then(async businesses => {
            res.status(200).json(businesses);
        });
    } catch (error) {
        res.status(400).json({error: error.toString()});
    }
});

router.get('/categories/:type', async function (req, res, next) {
    try {
        await Business.findAll({
            where: {
                category: req.params.type
            }
        }).then(async businesses => {
            res.status(200).json(businesses);
        });
    } catch (error) {
        res.status(400).json({error: error.toString()});
    }
});

router.get('/info', checkToken, async function (req, res, next) {
    try {
        const userId = decodeJWT(req.header.token).sub;
        getBusiness(userId).then(business => {
            res.status(200).json(business);
        });
    } catch (error) {
        res.status(400).json({error: error.toString()});
    }
});

router.get('/info/:id', checkToken, async function (req, res, next) {
    try {
        getBusinessById(req.params.id).then(business => {
            res.status(200).json(business);
        });
    } catch (error) {
        res.status(400).json({error});
    }
});

router.put('/info', checkToken, async function (req, res, next) {
    try {
        const userId = decodeJWT(req.header.token).sub;
        updateBusiness(req.body, userId).then(business => {
            res.status(200).json(business);
        });
    } catch (error) {
        res.status(400).json({error: error.toString()});
    }
});

router.get('/search', async function (req, res, next) {
    try {
        const keyword = "%" + req.query.keyword + "%";
        await Business.findAll({
            where: {
                [Op.or]: [
                    {
                        name: {
                            [Op.like]: keyword
                        }
                    },
                    {
                        address: {
                            [Op.like]: keyword
                        }
                    },
                    {
                        country: {
                            [Op.like]: keyword
                        }
                    },
                    {
                        province: {
                            [Op.like]: keyword
                        }
                    },
                    {
                        city: {
                            [Op.like]: keyword
                        }
                    },
                    {
                        category: {
                            [Op.like]: keyword
                        }
                    },
                    {
                        website: {
                            [Op.like]: keyword
                        }
                    }
                ]
            }
        }).then(async businesses => {
            res.status(200).json(businesses);
        })
    } catch (error) {
        res.status(400).json({error: error.toString()});
    }
});

router.get('/:businessId/posts', async function (req, res, next) {
    try {
        Review.findAll({
            where: {
                businessId: req.params.businessId
            }
        }).then(async reviews => {
            res.status(200).json(reviews);
        });
    } catch (error) {
        res.status(400).json({error: error.toString()});
    }
});

module.exports = router;
