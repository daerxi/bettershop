const express = require('express');
const {updateBusiness, getBusiness} = require("../controllers/businesses");
const {decodeJWT, checkToken} = require("../controllers/auth");
const {Business} = require("../sync");
const router = express.Router();

router.get('/', async function(req, res, next) {
  try {
    await Business.findAll().then(async businesses => {
      res.status(200).json(businesses);
    });
  } catch (error) {
    res.status(400).json({error});
  }
});

router.get('/:type', async function(req, res, next) {
  try {
    await Business.findAll({
      where: {
        category: req.params.type
      }
    }).then(async businesses => {
      res.status(200).json(businesses);
    });
  } catch (error) {
    res.status(400).json({error});
  }
});

router.get('/info', checkToken ,async function(req, res, next) {
  try {
    const userId = decodeJWT(req.header.token).sub;
    getBusiness(userId).then(business => {
      res.status(200).json(business);
    });
  } catch (error) {
    res.status(400).json({error});
  }
});

router.put('/info', checkToken ,async function(req, res, next) {
  try {
    const userId = decodeJWT(req.header.token).sub;
    updateBusiness(req.body, userId).then(business => {
      res.status(200).json(business);
    });
  } catch (error) {
    res.status(400).json({error});
  }
});

module.exports = router;
