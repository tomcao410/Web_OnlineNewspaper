var express = require('express');
var router = express.Router();
var topics = require('../model/topics');
var ftPosts = require('../model/ftPosts');
var allPost = require('../model/allPosts');
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
  var getAllPosts = allPost.all();
  var getFtPosts = ftPosts.all();
  var getTopMost = ftPosts.topMost();
  var getTopTen = ftPosts.topTenTopics();
  Promise.all([getTopics, getAllPosts, getFtPosts, getTopMost, getTopTen]).then(result => {
    var topics = transformTopics(result[0]);
    var allPosts = JSON.parse(JSON.stringify(result[1]));
    var ftPosts = JSON.parse(JSON.stringify(result[2]));
    var ftTopMost = JSON.parse(JSON.stringify(result[3]));
    var ftTopTen = JSON.parse(JSON.stringify(result[4]));
    res.render('index', { topics: topics, allPosts: allPosts, ftPosts: ftPosts, ftTopMost: ftTopMost, ftTopTen: ftTopTen,title: 'Express' });  
  }
  ).catch(err => {
    console.log(err);
  });   
});

router.get('/page/:pagenum', function(req, res, next) {
  var getTopics = topics.all();
  Promise.all([getTopics]).then(result => {
    var topics = transformTopics(result[0]);
    res.render('panination',{ topics: topics , title:req.params.pagenum});  
  }
  ).catch(err => {
    console.log(err);
  });
});

router.get('/all', function(req, res, next) {
  var getAllPosts = allPost.all();
  var getTopics = topics.all();
  var getTopTen = ftPosts.topTenTopics();
  Promise.all([getTopics, getAllPosts, getTopTen]).then(result => {
    var topics = transformTopics(result[0]);
    var allPosts = JSON.parse(JSON.stringify(result[1]));
    var ftTopTen = JSON.parse(JSON.stringify(result[2]));
    res.render('all', {topics: topics, allPosts: allPosts, ftTopTen: ftTopTen,title: 'Express' });  
  }
  ).catch(err => {
    console.log(err);
  });
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
  var getAllPosts = allPost.all();
  var getTopTen = ftPosts.topTenTopics();
  Promise.all([getTopics, getAllPosts, getTopTen]).then(result => {
    var topics = transformTopics(result[0]);
    var allPosts = JSON.parse(JSON.stringify(result[1]));
    var ftTopTen = JSON.parse(JSON.stringify(result[2]));
    res.render('category', { topics: topics, allPosts: allPosts, ftTopTen: ftTopTen, title:req.params.category });  
  }
  ).catch(err => {
    console.log(err);
  });   
});


router.get('/:category/:subCategory/:title', function(req, res, next) {
  var getTopics = topics.all();
  var getAllPosts = allPost.all();
  Promise.all([getTopics, getAllPosts]).then(result => {
    var topics = transformTopics(result[0]);
    var allPosts = JSON.parse(JSON.stringify(result[1]));
    res.render('image-post',{ topics: topics, allPosts: allPosts,title:req.params.title}); 
  }
  ).catch(err => {
    console.log(err);
  });   
});
router.get('/:category/:subCategory', function(req, res, next) {
  var getTopics = topics.all();
  var getAllPosts = allPost.all();
  var getTopTen = ftPosts.topTenTopics();
  Promise.all([getTopics, getAllPosts, getTopTen]).then(result => {
    var topics = transformTopics(result[0]);
    var allPosts = JSON.parse(JSON.stringify(result[1]));
    var ftTopTen = JSON.parse(JSON.stringify(result[2]));
    res.render('subCategory',{topics: topics, allPosts: allPosts, ftTopTen: ftTopTen, title:req.params.subCategory});
  }
  ).catch(err => {
    console.log(err);
  });  
});


module.exports = router;

