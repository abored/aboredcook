var express = require('express');
var router = express.Router();

router.use('/', require('./users.js'))
router.use('/', require('./recipes.js'))

// GET homepage (vores SPA index.ejs)
router.get('/', function(req, res) {
    res.render('index.ejs', {});
});

module.exports = router;
