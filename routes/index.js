const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'BetterShop' });
});

router.post('/verify', function(req, res, next) {
  
});

module.exports = router;
