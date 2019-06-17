var express = require('express');
var router = express.Router();
var posts = require('../model/posts');
/* GET home page. */
router.get('/', (req, res) => {
  var p= posts.all();
  p.then( rows => {
      
      res.render('index', { postall: rows, title: 'Express' });
      console.log(rows);
    }
  ).catch( err =>{
      console.log(err);
    });
});
router.get('/all', function(req, res, next) {
  res.render('all', { title: 'Express' });
});
router.get('/TrangCaNhan', function(req, res, next) {
  res.render('infor', { title: 'Express' });
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

