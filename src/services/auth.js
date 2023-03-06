import db from '../models'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
require('dotenv').config()
const hashPassword = password => bcryptjs.hashSync(password, bcryptjs.genSaltSync(10))
export const register = ({ username, email, password }) => new Promise(async (resolve, reject) => {
   try {
      const [row, create] = await db.User.findOrCreate({
         where: { email },
         defaults: {
            username,
            email,
            password: hashPassword(password)
         }
      })
      resolve({
         DT: '',
         EC: create ? 0 : 1,
         EM: create ? "Register user success" : "Email already exist"
      })
   } catch (error) {
      reject(error);
   }
})
export const login = ({ email, password }) => new Promise(async (resolve, reject) => {
   try {
      const row = await db.User.findOne({
         where: { email },
         raw: true
      })
      const checkPass = row && bcryptjs.compareSync(password, row.password)
      const token = checkPass ? jwt.sign({
         email: row.email, username: row.username, password: row.password
      }, process.env.JWT_SECRET, { expiresIn: '1h' }) : '';

      resolve({
         DT: token && { email: row.email, username: row.username, image: row.image, role: row.role, access_token: token },
         EC: token ? 0 : 1,
         EM: token ? "Login success" : row ? ' password incorrect' : 'email is not register'
      })
   } catch (error) {
      reject(error);
   }
})