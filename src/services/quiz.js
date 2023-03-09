import { Op } from 'sequelize';
import { cloudinary } from '../middleware/uploadImage';
import db from '../models'

require('dotenv').config()

export const getQuiz = ({ page, limit, order, name }) => new Promise(async (resolve, reject) => {
   try {

      const query = {};
      const queries = {};
      let totalRows = await db.Quiz.count();
      let totalPages = totalRows ? 1 : 0
      if (limit) {
         if (+limit <= 0 || +limit > totalRows) limit = totalRows
         totalPages = Math.ceil(totalRows / limit)
         if (page) {
            if (+page <= 0 || +page > totalPages) page = 1
            queries.offset = limit * (page - 1);
         }
         queries.limit = +limit;
      }
      queries.order = order ? [order] : [['id', 'DESC']];
      if (name) query.name = { [Op.substring]: name }
      const { count, rows } = await db.Quiz.findAndCountAll({
         attributes: { exclude: ['createdAt', 'updatedAt'] },
         where: { ...query },
         ...queries,

         raw: true
      })

      resolve({
         DT: count ? { totalRows, totalPages, quiz: rows } : '',
         EC: count ? 0 : 1,
         EM: count ? "Success" : "Data not found"
      })
   } catch (error) {
      reject(error);
   }
})
export const getQuizById = (id) => new Promise(async (resolve, reject) => {
   try {

      const query = { id }
      if (id === 'all') delete query.id
      const rows = await db.Quiz.findAll({
         attributes: { exclude: ['createdAt', 'updatedAt'] },
         where: { ...query },
         order: [['id', 'DESC']],

         raw: true
      })
      console.log(rows);
      resolve({
         DT: rows ? rows : '',
         EC: rows ? 0 : 1,
         EM: rows ? "Success" : "Data not found"
      })
   } catch (error) {
      reject(error);
   }
})


export const createQuiz = (body) => new Promise(async (resolve, reject) => {
   try {
      const row = await db.Quiz.create({
         ...body
      })
      resolve({
         DT: '',
         EC: row ? 0 : 1,
         EM: row ? "Create quiz success" : "Create fail"
      })

   } catch (error) {
      reject(error);
   }
})


export const updateQuiz = ({ id, ...body }) => new Promise(async (resolve, reject) => {
   try {
      // console.log(body);
      const response = await db.Quiz.update({
         ...body,
      }, { where: { id } })
      // console.log(fileData);
      resolve({
         DT: '',
         EC: response[0] > 0 ? 0 : 1,
         EM: response[0] > 0 ? `Update ${response[0]} Quiz` : 'quizId not found'
      })
   } catch (error) {
      reject(error);
   }
})
export const deleteQuiz = (id) => new Promise(async (resolve, reject) => {
   try {
      const response = await db.Quiz.destroy({ where: { id: id } })
      resolve({
         DT: '',
         EC: response > 0 ? 0 : 1,
         EM: response > 0 ? `Delete ${response} quiz` : 'quizId not found'
      })
   } catch (error) {

      reject(error);
   }
})