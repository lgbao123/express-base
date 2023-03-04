
const connection = require('../config/database')
const getHomePage = (req, res) => {


   res.render('index')
}
const test = (req, res) => {
   let user = []
   connection.query(
      'SELECT * FROM  Users u ',
      function (err, results, fields) {
         // console.log(results); // results contains rows returned by server
         user = results;
         res.send(JSON.stringify(user));
      }
   )
   return 'test'
}

module.exports = {
   getHomePage, test
}