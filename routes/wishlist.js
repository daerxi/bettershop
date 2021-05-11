const express = require('express');
const {getWishListByUserId} = require("../controllers/users");
const {Op} = require("sequelize");
const {getBusinessById} = require("../controllers/businesses");
const {decodeJWT, checkToken} = require("../controllers/auth");
const {WishList} = require("../sync");
const router = express.Router();

router.get('/', checkToken, async function (req, res, next) {
    try {
        const userId = decodeJWT(req.header.token).sub;
        await getWishListByUserId(userId).then(async wishlists => {
            let businesses = []
            if (wishlists.length > 0) {
                for (const wishlist of wishlists) {
                    await getBusinessById(wishlist.dataValues.businessId)
                        .then(async business => businesses.push(business.dataValues))
                        .catch(e => res.status(400).json({error: e.toString()}))
                }
                res.status(200).json(businesses);
            } else res.status(200).json(businesses);
        }).catch(e => res.status(400).json({error: e.toString()}))
    } catch (e) {
        res.status(400).json({error: e.toString()});
    }
});

router.post('/', checkToken, async function (req, res, next) {
    const userId = decodeJWT(req.header.token).sub;
    await WishList.create({
        userId,
        businessId: req.body.businessId
    }).then(async wishlist => {
        if (wishlist) res.status(201).json(wishlist);
        else res.status(400).json({error: "Update wishlist failed."});
    }).catch(e => res.status(400).json({error: "Update wishlist failed.", reason: e.toString()}));
});

router.get('/:businessId', checkToken, async function (req, res, next) {
    try {
        const userId = decodeJWT(req.header.token).sub;
        const businessId = parseInt(req.params.businessId);
        WishList.findAll({
            where: {
                [Op.and]: [
                    {
                        userId
                    },
                    {
                        businessId
                    }
                ]
            }
        }).then(async wishlist => {
            if (wishlist.length > 0) res.status(200).json({success: true});
            else res.status(200).json({success: false});
        }).catch(e => res.status(400).json({error: e.toString()}));
    } catch (e) {
        res.status(400).json({error: e.toString()});
    }

});


module.exports = router;