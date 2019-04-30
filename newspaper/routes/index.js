var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/all', function(req, res, next) {
  res.render('all', { title: 'Express' });
});
router.get('/:category/:subCategory/:title', function(req, res, next) {
  res.render('image-post',{title:req.params.title});
});
router.get('/:category', function(req, res, next) {
  res.render('category',{title:req.params.category});
});
router.get('/:category/:subCategory', function(req, res, next) {
  res.render('subCategory',{title:req.params.subCategory});
});

module.exports = router;

