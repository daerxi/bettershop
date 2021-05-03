const express = require('express');
const {Op} = require("sequelize");
const {updateBusiness, getBusiness, getBusinessById} = require("../controllers/businesses");
const {decodeJWT, checkToken} = require("../controllers/auth");
const {isNullOrEmpty} = require("../common/utils");
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
        const getBus = (get, param) => {
            get(param).then(business => {
                    if (business) res.status(200).json(business);
                    else res.status(404).json({error: "Business not found"});
            });
        }
        if (isNullOrEmpty(req.query.id) && isNullOrEmpty(req.query.userId)) {
            const userId = decodeJWT(req.header.token).sub;
            getBus(getBusiness, userId)
        } else if (isNullOrEmpty(req.query.userId) && !isNullOrEmpty(req.query.id)) {
            getBus(getBusinessById, req.query.id)
        } else if (isNullOrEmpty(req.query.id) && !isNullOrEmpty(req.query.userId)) {
            getBus(getBusinessById, req.query.userId)
        } else {
            res.status(400).json({error: "Wrong query params"});
        }
    } catch (error) {
        res.status(400).json({error: error.toString()});
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

router.get('/:businessId/reviews', async function (req, res, next) {
    try {
        Review.findAll({
            where: {
                businessId: req.params.businessId
            }
        }).then(async reviews => {
            let rate = 0;
            for (const review of reviews) {
                rate += review.rate;
            }
            rate = parseInt(rate/reviews.length);
            res.status(200).json({rate, reviews});
        });
    } catch (error) {
        res.status(400).json({error: error.toString()});
    }
});

router.post('/:businessId/reviews', checkToken, async function (req, res, next) {
    try {
        const userId = decodeJWT(req.header.token).sub;
        Business.findOne({
            where: {
                id: req.params.businessId
            }
        }).then(async business => {
            if (business) {
                await Review.create({
                    userId,
                    businessId: business.id,
                    content: req.body.content.trim(),
                    rate: req.body.rate
                }).then(async review => {
                    res.status(201).json(review);
                }).catch(e => {
                    res.status(400).json({error: e.toString()})
                });
            } else {
                res.status(404).json({error: "Business is not found."});
            }
        });
    } catch (error) {
        res.status(400).json({error: error.toString()});
    }
})

module.exports = router;