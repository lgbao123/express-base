
// const connection = require('../config/database')
const getHomePage = async (req, res) => {
   return res.send('OK')
   const [results, fields] = await connection.query(
      'SELECT * FROM  Users u ')
   res.render('index', { userList: results })
}
const getCreatePage = (req, res) => {
   res.render('createUser')
}
const postCreateUser = async (req, res) => {

   const { email, name, city } = req.body;
   const [results, fields] = await connection.query(
      ' INSERT INTO Users (email , name ,city)  VALUES (?,?,?)', [email, name, city]);

   // const [userList] = await connection.query(
   //    'SELECT * FROM  Users u ')
   // res.render('index', { userList: userList })
   res.redirect('/')
}

module.exports = {
   getHomePage, getCreatePage, postCreateUser
}