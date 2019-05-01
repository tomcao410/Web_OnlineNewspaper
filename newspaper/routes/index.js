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


router.get('/entertainment', function(req, res, next) {
  res.render('entertainment', { title: 'Express' });
});
router.get('/entertainment/:category/:title', function(req, res, next) {
  res.render('image-post',{title:req.params.title});
});
router.get('/entertainment/movie', function(req, res, next) {
  res.render('movie', { title: 'Express' });
});
router.get('/entertainment/music', function(req, res, next) {
  res.render('music', { title: 'Express' });
});
router.get('/sport', function(req, res, next) {
  res.render('sports', { title: 'Express' });
});
router.get('/sport/:category/:title', function(req, res, next) {
  res.render('image-post',{title:req.params.title});
});
router.get('/sport/soccer', function(req, res, next) {
  res.render('soccer', { title: 'Express' });
});
router.get('/sport/tennis', function(req, res, next) {
  res.render('tennis', { title: 'Express' });
});

module.exports = router;

