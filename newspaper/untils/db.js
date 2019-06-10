var mysql      = require('mysql');
var createConnection = ()=>{
  return mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'newspaper'
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
  }
}
 
