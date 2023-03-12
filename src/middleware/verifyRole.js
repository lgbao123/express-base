
require('dotenv').config()
// var jwt = require('jsonwebtoken');
const { unAuth } = require('./handleError');
export const isAdmin = (req, res, next) => {
   const { role } = req.user;

   if (role !== 'ADMIN') return unAuth(res, 'Require role Admin')
   next();
}

