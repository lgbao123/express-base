import db from '../models'
import bcryptjs from 'bcryptjs'
import { cloudinary } from '../middleware/uploadImage'
import { getPublicId } from '../helper/utils'
import jwt, { TokenExpiredError } from "jsonwebtoken";
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
      //create access token
      const accessToken = checkPass ? jwt.sign({
         id: row.id, email: row.email, username: row.username, password: row.password
      }, process.env.JWT_SECRET, { expiresIn: '10d' }) : '';

      //create refresh token
      let rf_token = ''
      if (accessToken) {
         rf_token = jwt.sign({
            email: row.email
         }, process.env.JWT_SECRET, { expiresIn: '30d' });
         await db.User.update({ rf_token }, { where: { email } })
      }

      resolve({
         DT: accessToken && { email: row.email, username: row.username, image: row.image, role: row.role, access_token: accessToken, refresh_token: rf_token },
         EC: accessToken ? 0 : 1,
         EM: accessToken ? "Login success" : row ? ' password incorrect' : 'email is not register'
      })
   } catch (error) {
      reject(error);
   }
})
export const updateProfile = (email, body, fileData) => new Promise(async (resolve, reject) => {
   try {
      let query = {}
      query.username = body.username
      // check user delete image
      const isDelete = 'userImage' in body
      const user = await db.User.findOne({ where: { email } })

      if (fileData || isDelete) {
         //  delete IMG
         if (user && user.image) cloudinary.v2.uploader.destroy(getPublicId(user.image))
         //CLient has upload image
         if (fileData) query.image = fileData.url
         //CLient has send '' to delete img
         if (isDelete) query.image = null
      }

      const response = await db.User.update({
         ...query
      }, { where: { email } })
      // console.log(fileData);
      resolve({
         DT: '',
         EC: response[0] > 0 ? 0 : 1,
         EM: response[0] > 0 ? `Update success` : 'Update not success'
      })
      if (!response[0]) cloudinary.v2.uploader.destroy(fileData.public_id)
   } catch (error) {
      if (fileData) cloudinary.v2.uploader.destroy(fileData.public_id)
      reject(error);
   }
})

export const refreshToken = ({ refresh_token, email }) => new Promise(async (resolve, reject) => {
   try {
      jwt.verify(refresh_token, process.env.JWT_SECRET, function (err, decoded) {
         if (err) {
            const isExpired = err instanceof TokenExpiredError
            if (isExpired) {
               resolve({
                  DT: '',
                  EC: -999,
                  EM: 'refresh_token expired'
               })
            } else {
               resolve({
                  DT: '',
                  EC: 1,
                  EM: 'refresh_token invalid'
               })
            }
         }
      });
      const row = await db.User.findOne({ where: { rf_token: refresh_token, email } })
      //create access token
      let accessToken = ''
      if (row) {
         accessToken = jwt.sign({
            id: row.id, email: row.email, username: row.username, password: row.password
         }, process.env.JWT_SECRET, { expiresIn: '10d' });
      }

      resolve({
         DT: accessToken && { access_token: accessToken, refresh_token: refresh_token },
         EC: accessToken ? 0 : 1,
         EM: accessToken ? "Success" : 'refresh_token not found , you must login'
      })

   } catch (error) {
      reject(error);
   }
})
export const logOut = ({ refresh_token, email }) => new Promise(async (resolve, reject) => {
   try {
      const response = await db.User.update({ rf_token: null }, { where: { rf_token: refresh_token, email } })
      console.log(response);
      resolve({
         DT: "",
         EC: response[0] > 0 ? 0 : 1,
         EM: response[0] > 0 ? "Logout Success" : 'refresh_token not found'
      })

   } catch (error) {
      reject(error);
   }
})