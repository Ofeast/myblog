var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
   res.render('admin', { title: '后台管理' });
});

// router.get('/', function(req, res, next) {
//   res.render('admin', { title: 'Express' });	
// });
module.exports = router;
