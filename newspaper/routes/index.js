var express = require('express');
var router = express.Router();
var topics = require('../model/topics');
var posts = require('../model/posts');
var _ = require('lodash');
/* GET home page. */

// router.get('*', function(req, res, next) {
//   var p = topics.all();
//   p.then(rows => {
//     rows = JSON.parse(JSON.stringify(rows));
//     rowsGroupby = _.groupBy(rows, function(row) {
//       return row.categoryName;
//     })
//     rows = _.map(rowsGroupby, function(rowGroupby, key) {
//       return { categoryName: key, subCategories: rowGroupby };
//     });
//     console.log('abc');
//     res.render('template/header2', { topics: rows, title: 'Express' });  
//   }
//   ).catch(err => {
//     console.log(err);
//   });
// });

function transformTopics(rows) {
  rows = JSON.parse(JSON.stringify(rows));
    rowsGroupby = _.groupBy(rows, row => row.categoryName)
    rows = _.map(rowsGroupby, (rowGroupby, key) => ( { categoryName: key, subCategories: rowGroupby }));
    return rows;
}

router.get('/', function(req, res, next) {
  var getTopics = topics.all();
  Promise.all([getTopics]).then(result => {
    var topics = transformTopics(result[0]);
    res.render('index', { topics: topics, title: 'Express' });  
  }
  ).catch(err => {
    console.log(err);
  });   
});

router.get('/page/:pagenum', function(req, res, next) {
  res.render('panination',{title:req.params.pagenum});
});
router.get('/page/:pagenum', function(req, res, next) {
  res.render('panination',{title:req.params.pagenum});
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
  var getTopics = topics.all();
  Promise.all([getTopics]).then(result => {
    var topics = transformTopics(result[0]);
    res.render('category', { topics: topics, title:req.params.category });  
  }
  ).catch(err => {
    console.log(err);
  });   
});

router.get('/:category/:subCategory/:title', function(req, res, next) {
  res.render('image-post',{title:req.params.title});
});
router.get('/:category/:subCategory', function(req, res, next) {
  res.render('subCategory',{title:req.params.subCategory});
});

module.exports = router;

