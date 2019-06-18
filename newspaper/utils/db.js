var mysql      = require('mysql');

var bcrypt = require('bcrypt');

var createConnection = ()=>{
  return mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'tom123456',
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
      var id = entity[idField];
      delete entity[idField];

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
  login: (username, password) =>{
    return new Promise ((resolve, reject) =>{
      this.findUser(username, function(user){
        if (user) {
          if (bcrypt.compareSync(password, user.passwordString))
          {
            resolve(user);
            return;
          }
          else {
            reject(null);
          }
        }
        else {
          reject(null);
        }
      })
    //   var sql = `select username, passwordString, userClass from users where username='${username}' AND passwordString='${password}'`
    //   console.log(sql)
    //   var connection = createConnection();
    //   connection.connect();
    //
    //   connection.query(sql, function (error, results, fields) {
    //     if (error) reject(error);
    //     else {
    //       resolve(results);
    //     }
    //     connection.end();
    // });
   });
  },

  // User registers
  findUser: username =>{
    return new Promise ((resolve, reject) =>{
      var sql = `select username, passwordString from users where username='${username}'`
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

  register: (username, password, fullname, dob, email) => {
    return new Promise((resolve, reject) => {
      var passHashed = bcrypt.hashSync(password, 10);
      console.log(passHashed);
      var sql = `INSERT INTO users (username, passwordString, userClass, fullname, dabirthday, email) VALUES ('${username}', '${passHashed}', ${1}, '${fullname}', '${dob}', '${email}')`;
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
