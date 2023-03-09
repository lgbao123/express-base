import { Op } from 'sequelize';
import db from '../models'

require('dotenv').config()

export const getQuestionById = (id) => new Promise(async (resolve, reject) => {
   try {

      const { count, rows } = await db.Question.findAndCountAll({
         attributes: { exclude: ['createdAt', 'updatedAt'] },
         where: { id },
         raw: true
      })

      resolve({
         DT: count ? rows : '',
         EC: count ? 0 : 1,
         EM: count ? "Success" : "Data not found"
      })
   } catch (error) {
      reject(error);
   }
})



export const createQuestion = (body) => new Promise(async (resolve, reject) => {
   try {
      const quiz = await db.Quiz.findOne({ where: { id: body.quizId } })

      if (!quiz) {
         return resolve({
            DT: '',
            EC: 1,
            EM: "Quiz not in DB"
         })
      }
      const row = await db.Question.create({
         ...body
      })
      resolve({
         DT: row ? row : '',
         EC: row ? 0 : 1,
         EM: row ? "Create question success" : "Create fail"
      })

   } catch (error) {
      reject(error);
   }
})


export const updateQuestion = ({ id, ...body }) => new Promise(async (resolve, reject) => {
   try {
      // console.log(body);
      const response = await db.Question.update({
         ...body,
      }, { where: { id } })
      // console.log(fileData);
      resolve({
         DT: '',
         EC: response[0] > 0 ? 0 : 1,
         EM: response[0] > 0 ? `Update ${response[0]} Question` : 'questionId not found'
      })
   } catch (error) {
      reject(error);
   }
})
export const deleteQuestion = (id) => new Promise(async (resolve, reject) => {
   try {
      const response = await db.Question.destroy({ where: { id: id } })
      resolve({
         DT: '',
         EC: response > 0 ? 0 : 1,
         EM: response > 0 ? `Delete ${response} quiz` : 'question not found'
      })
   } catch (error) {

      reject(error);
   }
})