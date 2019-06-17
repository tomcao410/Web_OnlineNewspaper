var mysql      = require('mysql');


var createConnection = ()=>{
  return mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '123456',
    database : 'Newspaper'
  });
}

module.exports = {
  load: sql =>{
    return new Promise ((resolve, reject) =>{
      var connection = createConnection();
      connection.connect();
    
      connection.query(sql, function (error, results, fields) {
        if (error) reject(error);
        else {
          resolve(results);
        }
        connection.end();
    });
   });
  },
  login: (username, password) =>{
    return new Promise ((resolve, reject) =>{
      var sql = `select username, passwordString, userClass from users where username='${username}' AND passwordString='${password}'`
      console.log(sql)
      var connection = createConnection();
      connection.connect();
    
      connection.query(sql, function (error, results, fields) {
        if (error) reject(error);
        else {
          resolve(results);
        }
        connection.end();
    });
   });
  }
}