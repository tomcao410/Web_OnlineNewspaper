var express = require('express');
var router = express.Router();
var topics = require('../model/topics');
var ftPosts = require('../model/ftPosts');
var allPost = require('../model/allPosts');
var users = require('../model/dataUser');
var findResult = require('../model/find');
var commentModel = require('../model/uploadCmt.js');
var postModel = require('../model/uploadPost');
var bcrypt = require('bcrypt');
var userModel = require('../model/user');
var catModel = require('../model/uploadCat');
var _ = require('lodash');

// ---------------- Reconfig object -----------------//
function transformTopics(rows) {
  rows = JSON.parse(JSON.stringify(rows));
    rowsGroupby = _.groupBy(rows, row => row.categoryName);
    rows = _.map(rowsGroupby, (rowGroupby, key) => ( { categoryName: key, subCategories: rowGroupby }));
    return rows;
}


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
    var topics = transformTopics(result[0]); console.log(topics);
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
  var verify = false;
  var verPsw = false;
  var verEmail = false
  if (entity.password == entity.confirmPass)
  {
    verPsw = true;
  }
  console.log(entity.password);
  console.log(entity.confirmPass);
  console.log(entity.email);
  if (entity.email.includes("@"))
  {
    verEmail = true;
  }
  if (verEmail == true && verPsw == true)
  {
    verify = true;
  }
  console.log("---------");
  console.log(verify);
  console.log("---------");
  
  if (verify == true) {
    var passHashed = bcrypt.hashSync(entity.password, 10);
    console.log(passHashed);
    var p = userModel.register(entity.username, passHashed, entity.fullname, entity.dob, entity.email);
    p.then(rows => {
      var find = userModel.findUser(entity.username);
      find.then(rowFound => {
        if (rowFound.length > 0)
        {
          req.session.userInfo = rowFound;
          req.session.username = rowFound[0].username;
          req.session.op = 0;
          console.log('Register succeed');
          console.log(rowFound);
          res.redirect('/');
        }
      }).catch(err => {
        console.log(err);
      });
    }).catch(err => {
      console.log(err);
    });
  }
  else
  {
    
    res.redirect('/');
  }
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
  let userInfo = req.session.userInfo;
  res.render('dashboard', { userInfo: userInfo, title: 'Express' });
});

router.get('/admin/profile', function(req, res, next) {
  let userInfo = req.session.userInfo;
  res.render('profile', { userInfo: userInfo, title: 'Express' });

});
router.get('/admin/users-table', function(req, res, next) {
  let userInfo = req.session.userInfo;
  var listUsers = userModel.all();
  listUsers.then(rows =>{
    if (rows.length > 0)
    {
      res.render('users-table', { userInfo: userInfo, listUsers: rows, title: 'Express' });
    }
    else
    {
      console.log('Loading users failed');
      res.redirect('admin/profile');
    }
  }).catch(err => {
    console.log(err);
  });
});

router.get('/admin/update-user', function(req, res, next) {
  let userInfo = req.session.userInfo;
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
  res.render('update-user', { userInfo: userInfo, title: 'Express' });

});

router.post('/admin/update-user', function(req, res, next) {
  let userInfo = req.session.userInfo;
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
  res.render('update-user', { userInfo: userInfo, title: 'Express' });

});

router.get('/admin/categories-table', function(req, res, next) {
  let userInfo = req.session.userInfo;
  var getTopics = topics.cat();
  var getSubTopics = topics.topicMng();
  Promise.all([getTopics, getSubTopics]).then(result => {
    var allTopics = JSON.parse(JSON.stringify(result[0]));
    var allSubtopics = JSON.parse(JSON.stringify(result[1]));
    res.render('categories-table', { userInfo: userInfo, topics: allTopics, subTopics: allSubtopics, title: 'Express' });
  }).catch(err => {
    console.log(err);
  })
});

router.get('/admin/add-categories', function(req, res, next) {
  let userInfo = req.session.userInfo;
  var getTopics = topics.cat();
  var getSubTopics = topics.subCat();
  Promise.all([getTopics, getSubTopics]).then(result => {
    var allTopics = JSON.parse(JSON.stringify(result[0]));
    var allSubtopics = JSON.parse(JSON.stringify(result[1]));
    res.render('add-categories', {userInfo: userInfo, topics: allTopics, subTopics: allSubtopics, title: 'Express' });
  }).catch(err => {
    console.log(err);
  })
});

router.post('/add-categories', (req, res) => {
  console.log(req.body);
  var isNewCat = req.body.categoryName;
  var getSubCatByCat = topics.subCatByCatId(req.body.selectBox);
  
  if (isNewCat.length == 0)
  {
    Promise.all([getSubCatByCat]).then(result => {
      var subCatByCat = JSON.parse(JSON.stringify(result[0]));
      var subCatId = subCatByCat[subCatByCat.length - 1].id + 1;
      var subCatEntity = {
        id: subCatId,
        categoryId: req.body.selectBox,
        subCategoryName: req.body.subCategoryName
      }
      catModel.addSubCat(subCatEntity).then(id => {
        console.log(id);
        res.redirect('/admin/add-categories');
      }).catch(err => {
        console.log(err);
      })
    }).catch(err => {
      console.log(err);
    });
    
  }
  else
  {
    var catEntity = {
      id: req.body.topicId,
      categoryName: req.body.categoryName
    }
    catModel.addCat(catEntity).then(id => {
      console.log(id);
      res.redirect('/admin/add-categories');
    }).catch(err => {
      console.log(err);
    })
  }
})

//-------------------------------------Posts section----------------------------------//
router.get('/admin/posts-table', function(req, res, next) {
  let userInfo = req.session.userInfo;
  var getAllPosts = allPost.allDefault();
  Promise.all([getAllPosts, userInfo]).then(result => {
    var allPosts = JSON.parse(JSON.stringify(result[0]));
    var user = JSON.parse(JSON.stringify(result[1]));
    var isLogin;
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
    res.render('posts-table', {allPosts: allPosts, isLogin: isLogin, userInfo: req.session.userInfo, title: 'Posts table' });
  }
  ).catch(err => {
    console.log(err);
  });
});

router.post('/admin/del-post', function(req, res, next){
  var fid = req.body.postID;
  var field = "id";
  postModel.delPost(field, fid).then(id => {
    console.log(id);
    res.redirect("/admin/posts-table");
  }).catch(err => {
    console.log(err);
  })
})

router.post("/saved", function(req, res, next){
  console.log(req.body);
  var entity = {
    id: req.body.postID,
    authorId: req.body.authorID,
    title: req.body.postTitle,
    sub_category: req.body.selectBox2,
    category: req.body.selectBox1,
    publishDate: req.body.toBePublishedDate,
    postExcerpt: req.body.postExcerpt,
    content: req.body.editor1,
    views: req.body.views,
    imgLink: req.body.imgLink,
    approval: req.body.approve,
    premium: req.body.premium
  }
  postModel.editPost(entity, "id").then(id => {
    console.log(id);
    res.redirect('/admin/posts-table');
  }).catch(err => {
    console.log(err);
  });
});

router.post('/admin/disapprove-post', function(req, res, next){
  console.log(req.body);
  postModel.disapprovePost("id", req.body.postID).then(id => {
    console.log(id);
    res.redirect('/admin/posts-table');
  }).catch(err => {
    console.log(err);
  });
});

router.post('/admin/approve-post', function(req, res, next){
  var today = new Date();
  var dd = String(today.getDate()).padStart(2,'0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  var dateStr = yyyy + '-' + mm + '-' + dd;
  postModel.publishDateUpdate("id", req.body.postID, dateStr).then(id => {
    console.log(id);
  }).catch(err => {
    console.log(err);
  });
  res.redirect('/admin/posts-table');
  // postModel.approvePost("id", req.body.postID).then(id => {
  //   console.log(id);
  // }).catch(err => {
  //   console.log(err);
  // });
  // res.redirect('/admin/posts-table');
});

router.get('/admin/edit-post', function (req, res, next) {
  var queryParam = req.url;
  var postId = queryParam.slice(queryParam.lastIndexOf('=') + 1);
  console.log(postId);
  var getPostDetail = allPost.byPostId(postId);
  var getTopics = topics.all();
  Promise.all([getPostDetail, getTopics]).then(result => {
    var postDetail = JSON.parse(JSON.stringify(result[0]));
    var topics = transformTopics(result[1]);
    console.log(postDetail);
    res.render('edit-post', { topics: topics, postDetail: postDetail, userInfo: req.session.userInfo, title: 'Sửa bài đăng' });
  }).catch(err => {
    console.log(err);
  })
});

router.get('/admin/write-post', function(req, res, next) {
  var getTopics = topics.all();
  var getAllPosts = allPost.allDefault();
  Promise.all([getTopics, getAllPosts]).then(result => {
    var topics = transformTopics(result[0]);
    var allPosts = JSON.parse(JSON.stringify(result[1]));
    var newestPostId = allPosts[allPosts.length - 1].id;
    var isLogin = true; var userInfo = null;
    console.log(req.session.userInfo);
    var userInfo = req.session.userInfo;
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
    res.render('write-post', { newestPostId: newestPostId,userInfo: userInfo,isLogin: isLogin, topics: topics, allPosts: allPosts,title: 'Đăng bài' });
  }
  ).catch(err => {
    console.log(err);
  });
});

router.post("/add-post", (req, res) => {
  console.log(req.body);
  var entity = {
    id: req.body.postID,
    authorId: req.body.authorID,
    title: req.body.postTitle,
    sub_category: req.body.selectBox2,
    category: req.body.selectBox1,
    publishDate: req.body.toBePublishedDate,
    postExcerpt: req.body.postExcerpt,
    content: req.body.editor1,
    views: req.body.views,
    imgLink: req.body.imgLink,
    approval: req.body.approve,
    premium: req.body.premium
  };
  console.log(entity);
  postModel.addPost(entity).then(id => {
    console.log(id);
    res.redirect("/admin/write-post");
  }).catch(err => {
    console.log(err);
  })
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

  Promise.all([getTopics, getAllPosts, getComments, getNewestCmt]).then(result => {
    var topics = transformTopics(result[0]);
    var allPosts = JSON.parse(JSON.stringify(result[1]));
    var comments = JSON.parse(JSON.stringify(result[2]));
    var newestCmt = JSON.parse(JSON.stringify(result[3]));
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
    res.render('image-post',{ curUserId: curUserId, isLogin: isLogin, userInfo: req.session.userInfo, topics: topics, allPosts: allPosts, comments: comments, newestCmt: newestCmt,title:req.params.title,category:req.params.category,subCategory:req.params.subCategory});
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
  // var Findresult = findResult.search();
  var page = req.query.page || 1;
  if (page < 1) page = 1;
  var limit = 10;
  var offset = (page - 1)* limit;
  var Findresult = findResult.searchByPage(limit, offset, searchtxt);
  Promise.all([getTopics,getAllPosts, Findresult]).then(result => {
    var topics = transformTopics(result[0]);
    var allPosts = JSON.parse(JSON.stringify(result[1]));
    var search = JSON.parse(JSON.stringify(result[2]));
    var isLogin = false;
    var total = search.length;
    var nPages = Math.floor(total/ limit);
    if (total % limit > 0) nPages++;
    var pages = [];
    for (i=1; i<= nPages;i++){
      var obj = {value: i};
      pages.push(obj);
    }
    var searchtxt = req.body.Searchbox;
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
    res.render('searchResult',{pages: pages, timkiem: searchtxt,isLogin: isLogin, userInfo: req.session.userInfo, topics: topics,allPosts: allPosts, searchResult: search});
}
).catch(err => {
  console.log(err);
});

});


router.post('/searchResult', (req, res) => {
  var entity = {
    txt: req.body.Searchbox,
  }
  var a = entity.txt;
  searchtxt = a;
  var getTopics = topics.all();
  var getAllPosts = allPost.all();
  var page = req.query.page || 1;
  if (page < 1) page = 1;
  var limit = 10;
  var offset = (page - 1)* limit;
  var Findresult = findResult.searchByPage(limit, offset, searchtxt);
  Promise.all([getTopics, getAllPosts, Findresult]).then(result => {
    var topics = transformTopics(result[0]);
    var allPosts = JSON.parse(JSON.stringify(result[1]));
    var search = JSON.parse(JSON.stringify(result[2]));
    var isLogin = false;
    var total = search.length;
    var nPages = Math.floor(total/ limit);
    if (total % limit > 0) nPages++;
    var pages = [];
    for (i=1; i<= nPages;i++){
      var obj = {value: i};
      pages.push(obj);
    }
    if (req.session.username) {
      console.log('There is a user');
      isLogin = true;
    }
    else {
      console.log('There is no user');
      isLogin = false;
    }
    res.render('searchResult', { pages: pages, timkiem: searchtxt, isLogin: isLogin, userInfo: req.session.userInfo, topics: topics, allPosts: allPosts, searchResult: search });
  }
  ).catch(err => {
    console.log(err);
  });
});


module.exports = router;
