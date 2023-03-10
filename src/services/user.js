import { Op } from 'sequelize';
import { getPublicId, hashPassword } from '../helper/utils';
import { cloudinary } from '../middleware/uploadImage';
import bcryptjs from 'bcryptjs'
import db from '../models'
import sequelize from 'sequelize'
require('dotenv').config()

export const getUser = ({ page: pageU, limit: limitU, order: orderU, username: usernameU }) => new Promise(async (resolve, reject) => {
   try {

      let totalRows = await db.User.count();
      const limit = +limitU || totalRows;
      let totalPages = Math.ceil(totalRows / limit) || 0
      const page = (+pageU > 0 && +pageU <= totalPages) ? +pageU : 1;
      const offset = (page - 1) * limit;
      const order = orderU ? [orderU] : [['id', 'DESC']];
      const queries = { limit, offset, order };
      const username = usernameU || '';
      const query = {}
      query.username = { [Op.substring]: username }

      const { count, rows } = await db.User.findAndCountAll({
         attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
         where: { ...query },
         ...queries,
         raw: true
      })
      totalRows = count
      console.log(count);
      totalPages = Math.ceil(totalRows / limit) || 0
      // console.log('>>>> Query :', query);
      // console.log('>>>> queries :', queries);
      // console.log('>>>> countUser :', countUser);
      // console.log('>>>> totalPage :', totalPage);
      resolve({
         DT: count ? { totalRows, totalPages, users: rows } : '',
         EC: count ? 0 : 1,
         EM: count ? "Success" : "Data not found"
      })
   } catch (error) {
      reject(error);
   }
})

export const createUser = (body, fileData) => new Promise(async (resolve, reject) => {
   try {
      // console.log(body);
      const { email } = body
      const response = await db.User.findOrCreate({

         where: { email },
         defaults: { ...body, password: hashPassword(body.password), image: fileData?.url },
         raw: true
      })

      resolve({
         DT: '',
         EC: response[1] ? 0 : 1,
         EM: response[1] ? "Create success" : "Email has exsist"
      })
      if (fileData && !response[1]) cloudinary.v2.uploader.destroy(fileData.public_id)
   } catch (error) {
      if (fileData) cloudinary.v2.uploader.destroy(fileData.public_id)
      reject(error);
   }
})


export const updateUser = ({ id, ...body }, fileData) => new Promise(async (resolve, reject) => {
   try {
      // console.log(body);
      const user = await db.User.findOne({ where: { id } })
      if (user && user.image) cloudinary.v2.uploader.destroy(getPublicId(user.image))
      if (fileData) {
         // console.log(fileData.url)
         body.image = fileData.url
      }
      const response = await db.User.update({
         ...body,
      }, { where: { id } })
      // console.log(fileData);
      resolve({
         DT: '',
         EC: response[0] > 0 ? 0 : 1,
         EM: response[0] > 0 ? `Update ${response[0]} user` : 'userid not found'
      })
      if (!response[0]) cloudinary.v2.uploader.destroy(fileData.public_id)
   } catch (error) {
      if (fileData) cloudinary.v2.uploader.destroy(fileData.public_id)
      reject(error);
   }
})
export const deleteUser = (id) => new Promise(async (resolve, reject) => {
   try {
      const user = await db.User.findOne({ where: { id: id } })
      if (user && user.image) cloudinary.v2.uploader.destroy(getPublicId(user.image))
      if (user) user.destroy()
      // const response = await db.User.destroy({ where: { id: id } })
      resolve({
         DT: '',
         EC: user ? 0 : 1,
         EM: user ? `Delete user success` : 'userid not found'
      })
   } catch (error) {

      reject(error);
   }
})
export const changePassword = (currentPass, newPass, id) => new Promise(async (resolve, reject) => {
   try {
      const user = await db.User.findOne({ where: { id: id } })
      const checkPass = user && bcryptjs.compareSync(currentPass, user.password)
      if (checkPass) user.update({ password: hashPassword(newPass) })
      // const response = await db.User.destroy({ where: { id: id } })
      resolve({
         DT: '',
         EC: checkPass ? 0 : 1,
         EM: checkPass ? `Update password success` : 'Password incorrect'
      })
   } catch (error) {

      reject(error);
   }
})

export const getHistory = (id) => new Promise(async (resolve, reject) => {
   try {

      const history = await db.User.findAll({
         where: { id: id },
         attributes: ['id', 'username', 'email'],
         include: [
            {
               model: db.History,
               required: true,
               attributes: ['totalCorrect', 'totalQuestion', 'createdAt'],
               include: {
                  model: db.Quiz, required: true,
                  attributes: ['name', 'description'],
               }
            },

         ],
         // raw: true
      })
      // const response = await db.User.destroy({ where: { id: id } })
      resolve({
         DT: history ? history : '',
         EC: history ? 0 : 1,
         EM: history ? `success` : 'userid not found'
      })
   } catch (error) {

      reject(error);
   }
})

export const getDashboard = (id) => new Promise(async (resolve, reject) => {
   try {
      // const countUser = db.User.count();
      const countQuiz = await db.Quiz.count();
      const countQuestion = await db.Question.count();
      const countAnswer = await db.Answer.count();
      const countUser = await db.User.findAll({
         attributes: [
            "role",
            [sequelize.fn("COUNT", sequelize.col("role")), "total"],
         ],
         group: "role",
         raw: true
      }) || []
      const roleUser = countUser.find(item => item.role === 'USER')
      const roleAdmin = countUser.find(item => item.role === 'ADMIN')
      const result = {
         users: {
            total: (+roleAdmin?.total + +roleUser?.total) || 0,
            countUsers: +roleUser.total || 0,
            countAdmin: +roleAdmin.total || 0,

         },
         others: {
            countQuiz: countQuiz || 0,
            countQuestions: countQuestion || 0,
            countAnswers: countAnswer || 0,
         }
      }

      resolve({
         DT: result,
         EC: 0,
         EM: result ? `success` : ' not found'
      })
   } catch (error) {

      reject(error);
   }
})
