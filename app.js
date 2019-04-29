var express = require('express');
var path = require('path');

var app = express();
var router = express.Router();

app.set('view engine', 'ejs');
app.use('/', express.static('views'));


router.get('/', function(req, res)
{
    res.render('index');
    //res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.use('/', router);

app.listen(process.env.port || 3000);



