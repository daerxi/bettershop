const express = require('express');
const {Business} = require("../sync");
const router = express.Router();

router.get('/', function(req, res, next) {
  try {
    Business.findAll().then(async businesses => {
      res.status(200).json(businesses);
    });
  } catch (error) {
    res.status(400).json({error});
  }
});

router.get('/:type', function(req, res, next) {
  try {
    Business.findAll({
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

module.exports = router;
