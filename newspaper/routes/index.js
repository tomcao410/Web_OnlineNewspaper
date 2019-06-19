var express = require('express');
var router = express.Router();
var topics = require('../model/topics');
var ftPosts = require('../model/ftPosts');
var allPost = require('../model/allPosts');
var users = require('../model/dataUser');
var findResult = require('../model/find');
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

// ----------------
function transformTopics(rows) {
  rows = JSON.parse(JSON.stringify(rows));
    rowsGroupby = _.groupBy(rows, row => row.categoryName)
    rows = _.map(rowsGroupby, (rowGroupby, key) => ( { categoryName: key, subCategories: rowGroupby }));
    return rows;
}


 router.post('/news/:category/:subCategory/:title', (req, res) => {
  // res.redirect('image-post',{ topics: topics, allPosts: allPosts, comments: comments,title:req.params.title,category:req.params.category,subCategory:req.params.subCategory}); 
  //console.log(req.body);
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

// ----------------- HOME page-----------------------
router.get('/', function(req, res, next) {
  var getTopics = topics.all();
  var getAllPosts = allPost.all();
  var getFtPosts = ftPosts.all();
  var getTopMost = ftPosts.topMost();
  var getTopTen = ftPosts.topTenTopics();
  var page = req.query.page || 1;
  if (page < 1) page = 1;
  var limit = 10;
  var offset = (page - 1) * limit;
  var getAllPostsByPages = allPost.pageBy(limit, offset);
  Promise.all([getTopics, getAllPosts, getFtPosts, getTopMost, getTopTen, getAllPostsByPages]).then(result => {
    var topics = transformTopics(result[0]);
    var allPosts = JSON.parse(JSON.stringify(result[1]));
    var ftPosts = JSON.parse(JSON.stringify(result[2]));
    var ftTopMost = JSON.parse(JSON.stringify(result[3]));
    var ftTopTen = JSON.parse(JSON.stringify(result[4]));
    var postsByPages = JSON.parse(JSON.stringify(result[5]));
    var isLogin = false;
    var total = allPosts.length;
    var nPages = Math.floor(total/ limit);
    if (total % limit > 0) nPages++;
    var pages = [];
    for (i=1; i<= nPages;i++){
      var obj = {value: i};
      pages.push(obj);
    }
    console.log(req.session.userInfo);
    if (req.session.username)
    {
      console.log('There is a user');
      isLogin = true;
    }
    else
    {
      console.log('There is no user');
      isLogin = false;
    }
    res.render('index', { pages: pages,postsByPages: postsByPages, isLogin: isLogin, userInfo: req.session.userInfo, topics: topics, allPosts: allPosts, ftPosts: ftPosts, ftTopMost: ftTopMost, ftTopTen: ftTopTen,title: 'Express' });
  }
  ).catch(err => {
    console.log(err);
  });   
});

// --------------------Login--------------------
var bcrypt = require('bcrypt');
var userModel = require('../model/user');
router.post('/login', (req, res) => {
  var entity = {
    username: req.body.username,
    password: req.body.password
  }
  console.log(entity.username)
  var find = userModel.findUser(entity.username);
  find.then(rowFound => {
    if (rowFound.length > 0)
    {
      console.log(rowFound[0].passwordString);
      if (bcrypt.compareSync(entity.password, rowFound[0].passwordString))
      {
        req.session.userInfo = rowFound;
        req.session.username = rowFound[0].username;
        console.log(req.session.username);
        req.session.op = 1;

        console.log('Login succeed');
        console.log(rowFound)
        res.redirect('/')
      }
      else{
        console.log('Login failed (bcrypt)');
        res.redirect('/')
      }
    }
    else
    {
      console.log('Login failed')
      res.redirect('/')
    }
  }).catch(err => {
    console.log(err);
  });
})

// --------------------Register--------------------
router.post('/register', (req, res) => {
  var entity = {
    username: req.body.username,
    password: req.body.password,
    confirmPass: req.body.confirmPass,
    fullname: req.body.fullname,
    email: req.body.email,
    dob: req.body.dobtimepicker
  }
  console.log(entity);
  var passHashed = bcrypt.hashSync(entity.password, 10);
  console.log(passHashed);
  var p = userModel.register(entity.username, passHashed, entity.fullname, entity.dob, entity.email);
  p.then(rows => {
    if (rows.length > 0)
    {
      req.session.user = rowFound;
      req.session.op = 0;
      console.log('Register succeed');
      console.log(rows);
      res.redirect('/');
    }
    else
    {
      console.log('Register failed')
      res.redirect('/')
    }
  }).catch(err => {
    console.log(err);
  });
});

// ------------------- Log Out ----------------------
router.get('/logout', function(req, res, next) {
  req.session.destroy(function (err) {
    if (err) {
      res.negotiate(err);
    }
    else {
      res.redirect('/');
    }
  })
})

// --------------------------------------------
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

//--------------------------------- All posts ---------------------------------------//
router.get('/all', function(req, res, next) {
  var getAllPosts = allPost.all();
  var getTopics = topics.all();
  var getTopTen = ftPosts.topTenTopics();

  var page = req.query.page || 1;
  if (page < 1) page = 1;
  var limit = 10;
  var offset = (page - 1) * limit;

  var getAllPostsByPages = allPost.pageBy(limit, offset);

  Promise.all([getTopics, getAllPosts, getTopTen, getAllPostsByPages]).then(result => {
    var topics = transformTopics(result[0]);
    var allPosts = JSON.parse(JSON.stringify(result[1]));
    var ftTopTen = JSON.parse(JSON.stringify(result[2]));
    var postsByPages = JSON.parse(JSON.stringify(result[3]));
    var isLogin = false;
    var query = "";
    
    var total = allPosts.length;
    var nPages = Math.floor(total/ limit);
    if (total % limit > 0) nPages++;
    var pages = [];
    for (i=1; i<= nPages;i++){
      var obj = {value: i};
      pages.push(obj);
    }

    if (req.session.username)
    {
      console.log('There is a user');
      isLogin = true;
    }
    else
    {
      console.log('There is no user');
      isLogin = false;
    }
    res.render('all', { postsByPages: postsByPages, pages: pages ,query: query, topics: topics, allPosts: allPosts, ftTopTen: ftTopTen, isLogin: isLogin, userInfo: req.session.userInfo, title: 'Express' });
  }
  ).catch(err => {
    console.log(err);
  });
});
router.get('/TrangCaNhan', function(req, res, next) {
  var getAllPosts = allPost.all();
  var getTopics = topics.all();
  var getTopTen = ftPosts.topTenTopics();
  Promise.all([getTopics, getAllPosts, getTopTen]).then(result => {
    var topics = transformTopics(result[0]);
    var allPosts = JSON.parse(JSON.stringify(result[1]));
    var ftTopTen = JSON.parse(JSON.stringify(result[2]));
    var isLogin = true;
    res.render('infor', {isLogin: isLogin, userInfo: req.session.userInfo, topics: topics, allPosts: allPosts, ftTopTen: ftTopTen,title: 'Express' });
  }
  ).catch(err => {
    console.log(err);
  });
});

router.post('/updateUserInfo', (req, res) => {
  var passHashed = bcrypt.hashSync(req.body.pass, 10);
  var entity = {
    id: req.session.userInfo[0].id,
    fullname: req.body.fullname,
    email: req.body.email,
    dabirthday: req.body.dobtimepicker,
    passwordString: passHashed
  }
  var p = userModel.update('id', entity);
  p.then(row => {
    var find = userModel.findUser(req.session.username);
    find.then(rowFound => {
      if (rowFound.length > 0)
      {
        req.session.userInfo = rowFound;
        console.log(rowFound);
        res.redirect('/');
      }
    }).catch(err => {
      console.log(err);
    });
  }).catch(err => {
    console.log(err);
  });
});


//----------------------DASHBOARD---------------------------
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

//------------------------------------- Browse by category---------------------------------//
router.get('/news/:category', function(req, res, next) {
  var getTopics = topics.all();
  var getAllPosts = allPost.all();
  var getPostsByCat = allPost.byCat(req.params.category);
  var getTopTen = ftPosts.topTenTopics();
  var page = req.query.page || 1;
  if (page < 1) page = 1;
  var limit = 10;
  var offset = (page - 1) * limit;
  var getAllPostsByPages = allPost.pageByCat(req.params.category,limit, offset);
  Promise.all([getTopics, getAllPosts, getTopTen, getAllPostsByPages, getPostsByCat]).then(result => {
    var topics = transformTopics(result[0]);
    var allPosts = JSON.parse(JSON.stringify(result[1]));
    var ftTopTen = JSON.parse(JSON.stringify(result[2]));
    var postsByPages = JSON.parse(JSON.stringify(result[3]));
    var postsByCat = JSON.parse(JSON.stringify(result[4]));
    var isLogin = false;
    var total = postsByCat.length;
    var nPages = Math.floor(total/ limit);
    if (total % limit > 0) nPages++;
    var pages = [];
    for (i=1; i<= nPages;i++){
      var obj = {value: i};
      pages.push(obj);
    }
    if (req.session.username)
    {
      console.log('There is a user');
      isLogin = true;
    }
    else
    {
      console.log('There is no user');
      isLogin = false;
    }
    res.render('category', { postsByPages: postsByPages,pages: pages,isLogin: isLogin, userInfo: req.session.userInfo, topics: topics, allPosts: allPosts, ftTopTen: ftTopTen, title:req.params.category });
  }
  ).catch(err => {
    console.log(err);
  });   
});


//-----------------------------Post details---------------------------------//
router.get('/news/:category/:subCategory/:title', function(req, res, next) {
  var getTopics = topics.all();
  var getAllPosts = allPost.all();
  var getComments = users.comments();
  var getNewestCmt = users.newestCmtId();
  var tags = allPost.loadtags();

  Promise.all([getTopics, getAllPosts, getComments, getNewestCmt, tags]).then(result => {
    var topics = transformTopics(result[0]);
    var allPosts = JSON.parse(JSON.stringify(result[1]));
    var comments = JSON.parse(JSON.stringify(result[2]));
    var newestCmt = JSON.parse(JSON.stringify(result[3]));
    var tags = JSON.parse(JSON.stringify(result[4]));
    var curUserId;
    var isLogin = false;
    if (req.session.username)
    {
      console.log('There is a user');
      isLogin = true;
      curUserId = req.session.userInfo[0].id;
    }
    else
    {
      console.log('There is no user');
      isLogin = false;
    }
    res.render('image-post',{ tagsNews: tags, curUserId: curUserId, isLogin: isLogin, userInfo: req.session.userInfo, topics: topics, allPosts: allPosts, comments: comments, newestCmt: newestCmt,title:req.params.title,category:req.params.category,subCategory:req.params.subCategory}); 
  }
  ).catch(err => {
    console.log(err);
  });   
});

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

//------------------------------------- Browse by sub-category---------------------------------//
router.get('/news/:category/:subCategory', function(req, res, next) {
  var getTopics = topics.all();
  var getAllPosts = allPost.all();
  var postsBySubCat = allPost.bySubCat(req.params.category, req.params.subCategory);
  var getTopTen = ftPosts.topTenTopics();
  var page = req.query.page || 1;
  if (page < 1) page = 1;
  var limit = 10;
  var offset = (page - 1) * limit;
  var getAllPostsByPages = allPost.pageBySubCat(req.params.category,req.params.subCategory,limit, offset);
  Promise.all([getTopics, getAllPosts, getTopTen, getAllPostsByPages, postsBySubCat]).then(result => {
    var topics = transformTopics(result[0]);
    var allPosts = JSON.parse(JSON.stringify(result[1]));
    var ftTopTen = JSON.parse(JSON.stringify(result[2]));
    var postsByPages = JSON.parse(JSON.stringify(result[3]));
    var postsBySubCat = JSON.parse(JSON.stringify(result[4]));
    var isLogin = false;
    var total = postsBySubCat.length;
    var nPages = Math.floor(total/ limit);
    if (total % limit > 0) nPages++;
    var pages = [];
    for (i=1; i<= nPages;i++){
      var obj = {value: i};
      pages.push(obj);
    }
    if (req.session.username)
    {
      console.log('There is a user');
      isLogin = true;
    }
    else
    {
      console.log('There is no user');
      isLogin = false;
    }
    res.render('subCategory',{pages: pages, postsByPages: postsByPages,isLogin: isLogin, userInfo: req.session.userInfo, topics: topics, allPosts: allPosts, ftTopTen: ftTopTen, title:req.params.subCategory, category:req.params.category});
  }
  ).catch(err => {
    console.log(err);
  });  

});
router.get('/searchResult', function(req, res, next) {
  var getTopics = topics.all();
  var getAllPosts = allPost.all();
  var Findresult = findResult.search();
  Promise.all([getTopics,getAllPosts, Findresult]).then(result => {
    var topics = transformTopics(result[0]);
    var allPosts = JSON.parse(JSON.stringify(result[1]));
    var search = JSON.parse(JSON.stringify(result[2]));
    var isLogin = false;
    if (req.session.username)
    {
      console.log('There is a user');
      isLogin = true;
    }
    else
    {
      console.log('There is no user');
      isLogin = false;
    }
    res.render('searchResult',{ isLogin: isLogin, userInfo: req.session.userInfo, topics: topics,allPosts: allPosts, searchResult: search});
} 
).catch(err => {
  console.log(err);
});  

});


router.post('/searchResult', (req, res) => {
/*   app.locals.searchtxt = req.body.Search-box;

 */  
  var entity = {
  txt: req.body.Searchbox,
}
  var a = entity.txt;
  searchtxt = a;
  var getTopics = topics.all();
  var getAllPosts = allPost.all();
  var Findresult = findResult.search();
  Promise.all([getTopics,getAllPosts, Findresult]).then(result => {
    var topics = transformTopics(result[0]);
    var allPosts = JSON.parse(JSON.stringify(result[1]));
    var search = JSON.parse(JSON.stringify(result[2]));
    var isLogin = false;
    if (req.session.username)
    {
      console.log('There is a user');
      isLogin = true;
    }
    else
    {
      console.log('There is no user');
      isLogin = false;
    }
    res.render('searchResult',{ timkiem:searchtxt, isLogin: isLogin, userInfo: req.session.userInfo, topics: topics,allPosts: allPosts, searchResult: search});
} 
).catch(err => {
  console.log(err);
});  
});
router.get('/tag/:idP/:tagName', function(req, res, next) {
  var getTopics = topics.all();
  var getAllPosts = allPost.all(); 
  var tags = allPost.loadtags();
  Promise.all([getTopics,getAllPosts,  tags]).then(result => {
    var topics = transformTopics(result[0]);
    var allPosts = JSON.parse(JSON.stringify(result[1]));
    var tags = JSON.parse(JSON.stringify(result[2]));
    var isLogin = false;
    if (req.session.username)
    {
      console.log('There is a user');
      isLogin = true;
    }
    else
    {
      console.log('There is no user');
      isLogin = false;
    }
    res.render('tagSearch',{ idPo:req.params.idP, title:req.params.tagName, tagsNews: tags, isLogin: isLogin, userInfo: req.session.userInfo, topics: topics,allPosts: allPosts});
  } 
  ).catch(err => {
    console.log(err);
  });  
});




module.exports = router;

