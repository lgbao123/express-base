
require('dotenv').config()
import jwt, { TokenExpiredError } from "jsonwebtoken";
// var jwt = require('jsonwebtoken');
const { unAuth } = require('./handleError');
const verifyToken = (req, res, next) => {
   let token = req.headers["authorization"]
   if (!token) return unAuth(res, 'You must login')
   token = token.split(' ')[1]
   jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
         const isExpired = err instanceof TokenExpiredError
         if (isExpired) return unAuth(res, 'Token is expired', isExpired)
         return unAuth(res, 'Token is invalid')
      }
      req.user = decoded
      next();
   });
}

export default verifyToken