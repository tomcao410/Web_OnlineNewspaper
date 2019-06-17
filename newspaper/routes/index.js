var express = require('express');
var router = express.Router();
var topics = require('../model/topics');
var ftPosts = require('../model/ftPosts');
var allPost = require('../model/allPosts');
var users = require('../model/dataUser');
var commentModel = require('../model/uploadCmt.js');
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


router.post('/news/:category/:subCategory/:title', (req, res) => {
  // res.redirect('image-post',{ topics: topics, allPosts: allPosts, comments: comments,title:req.params.title,category:req.params.category,subCategory:req.params.subCategory}); 
  console.log(req.body);
  // res.end('...');
  var entity = {
    commentId: req.body.commentID,
    postId: req.body.postID,
    userId: req.body.userID,
    commentContent: req.body.commentContent
  };
  var redirectUrl = "/news/" + req.params.category + "/" + req.params.subCategory + "/" + req.params.title;
  commentModel.addComment(entity).then(id => {
    console.log(id);
    res.redirect(redirectUrl);
  }).catch(err => {
    console.log(err);
  });
});


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
router.get('/TrangCaNhan', function(req, res, next) {
  var getAllPosts = allPost.all();
  var getTopics = topics.all();
  var getTopTen = ftPosts.topTenTopics();
  var getuser = users.inforuser();
  Promise.all([getTopics, getAllPosts, getTopTen, getuser]).then(result => {
    var topics = transformTopics(result[0]);
    var allPosts = JSON.parse(JSON.stringify(result[1]));
    var ftTopTen = JSON.parse(JSON.stringify(result[2]));
    var userinfo =  JSON.parse(JSON.stringify(result[3]));
    res.render('infor', {topics: topics, allPosts: allPosts, inforuser: userinfo, ftTopTen: ftTopTen,title: 'Express' });  
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

router.get('/news/:category', function(req, res, next) {
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

router.get('/news/:category/:subCategory/:title', function(req, res, next) {
  var getTopics = topics.all();
  var getAllPosts = allPost.all();
  var getComments = users.comments();
  var getNewestCmt = users.newestCmtId();
  Promise.all([getTopics, getAllPosts, getComments, getNewestCmt]).then(result => {
    var topics = transformTopics(result[0]);
    var allPosts = JSON.parse(JSON.stringify(result[1]));
    var comments = JSON.parse(JSON.stringify(result[2]));
    var newestCmt = JSON.parse(JSON.stringify(result[3]));
    res.render('image-post',{ topics: topics, allPosts: allPosts, comments: comments, newestCmt: newestCmt,title:req.params.title,category:req.params.category,subCategory:req.params.subCategory}); 
  }
  ).catch(err => {
    console.log(err);
  });   
});
router.get('/news/:category/:subCategory', function(req, res, next) {
  var getTopics = topics.all();
  var getAllPosts = allPost.all();
  var getTopTen = ftPosts.topTenTopics();
  Promise.all([getTopics, getAllPosts, getTopTen]).then(result => {
    var topics = transformTopics(result[0]);
    var allPosts = JSON.parse(JSON.stringify(result[1]));
    var ftTopTen = JSON.parse(JSON.stringify(result[2]));
    res.render('subCategory',{topics: topics, allPosts: allPosts, ftTopTen: ftTopTen, title:req.params.subCategory, category:req.params.category});
  }
  ).catch(err => {
    console.log(err);
  });  
});



module.exports = router;

