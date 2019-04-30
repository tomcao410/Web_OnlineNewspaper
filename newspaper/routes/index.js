var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/news', function(req, res, next) {
  res.render('news', { title: 'Express' });
});
router.get('/news/national', function(req, res, next) {
  res.render('national', { title: 'Express' });
});

router.get('/news/international', function(req, res, next) {
  res.render('international', { title: 'Express' });
});
router.get('/business', function(req, res, next) {
  res.render('business', { title: 'Express' });
});
router.get('/business/agricultural', function(req, res, next) {
  res.render('agricultural', { title: 'Express' });
});
router.get('/business/marine', function(req, res, next) {
  res.render('marine', { title: 'Express' });
});
router.get('/news/In', function(req, res, next) {
  res.render('image-post', { title: 'Express' });
});
router.get('/news/:category/:title', function(req, res, next) {
  res.render('image-post',{title:req.params.title});
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

