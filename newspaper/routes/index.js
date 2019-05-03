var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/all', function(req, res, next) {
  res.render('all', { title: 'Express' });
});
router.get('/admin/dashboard', function(req, res, next) {
  res.render('dashboard', { title: 'Express' });

});
router.get('/admin/profile', function(req, res, next) {
  res.render('profile', { title: 'Express' });

});
router.get('/admin/users-table', function(req, res, next) {
  res.render('users-table', { title: 'Express' });

});
router.get('/admin/posts-table', function(req, res, next) {
  res.render('posts-table', { title: 'Express' });

});
router.get('/admin/write-post', function(req, res, next) {
  res.render('write-post', { title: 'Express' });
});
router.get('/:category', function(req, res, next) {
  res.render('category',{title:req.params.category});
});
router.get('/:category/:subCategory/:title', function(req, res, next) {
  res.render('image-post',{title:req.params.title});
});
router.get('/:category/:subCategory', function(req, res, next) {
  res.render('subCategory',{title:req.params.subCategory});
});
module.exports = router;

