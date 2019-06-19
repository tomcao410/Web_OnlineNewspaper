var mysql      = require('mysql');

var createConnection = ()=>{
  return mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '30111998',
    database : 'Newspaper',
    timezone: 'Z',
    dateStrings: true
  });
}

module.exports = {
  load: sql => {
    return new Promise((resolve, reject) => {
      var connection = createConnection();
      connection.connect();
      connection.query(sql, (error, results, fields) => {
        if (error)
          reject(error);
        else {
          resolve(results);
        }
        connection.end();
      });
    });
  },

  add: (tableName, entity) => {
    return new Promise((resolve, reject) => {
      var sql = `insert into ${tableName} set ?`;
      var connection = createConnection();
      connection.connect();
      connection.query(sql, entity, (error, value) => {
        if (error)
          reject(error);
        else {
          resolve(value.insertId);
        }
        connection.end();
      });
    });
  },

  update: (tableName, idField, entity) => {
    return new Promise((resolve, reject) => {
      var id = entity.id;
      delete entity.id;

      var sql = `update ${tableName} set ? where ${idField} = ?`;
      var connection = createConnection();
      connection.connect();
      connection.query(sql, [entity, id], (error, value) => {
        if (error)
          reject(error);
        else {
          resolve(value.changedRows);
        }
        connection.end();
      });
    });
  },

  delete: (tableName, idField, id) => {
    return new Promise((resolve, reject) => {
      var sql = `delete from ${tableName} where ${idField} = ?`;
      var connection = createConnection();
      connection.connect();
      connection.query(sql, id, (error, value) => {
        if (error)
          reject(error);
        else {
          resolve(value.affectedRows);
        }
        connection.end();
      });
    });
  },

  // User logins
  findUser: username =>{
    return new Promise ((resolve, reject) =>{
      var sql = `select id, username, passwordString, userClass, fullname, userClass, DATE_FORMAT(dabirthday, "%Y-%m-%d") as dob, email from users where username='${username}'`
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
  },
  
  // User registers
  register: (username, password, fullname, dob, email) => {
    return new Promise((resolve, reject) => {
      var sql = `INSERT INTO users (username, passwordString, userClass, fullname, dabirthday, email) VALUES ('${username}', '${password}', ${1}, '${fullname}', '${dob}', '${email}')`;
      console.log(sql);
      var connection = createConnection();
      connection.connect();
      connection.query(sql, function(error, results, fields) {
        if (error) reject(error);
        else {
          resolve(results);
        }
        connection.end();
      })
    })
  }
}
