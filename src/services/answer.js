import { Op } from 'sequelize';
import db from '../models'

require('dotenv').config()




export const createAnswer = ({ correct_answer, ...body }) => new Promise(async (resolve, reject) => {
   try {
      const question = await db.Question.findOne({ where: { id: body.questionId } })

      if (!question) {
         return resolve({
            DT: '',
            EC: 1,
            EM: "Question not in DB"
         })
      }
      const row = await db.Answer.create({
         ...body,
         isCorrect: correct_answer.toLowerCase() === 'true'
      })
      resolve({
         DT: row ? row : '',
         EC: row ? 0 : 1,
         EM: row ? "Create answer success" : "Create fail"
      })

   } catch (error) {
      reject(error);
   }
})


export const updateAnswer = ({ id, correct_answer, ...body }) => new Promise(async (resolve, reject) => {
   try {

      const response = await db.Answer.update({
         ...body, isCorrect: correct_answer.toLowerCase() === 'true'
      }, { where: { id } })
      // console.log(fileData);
      resolve({
         DT: '',
         EC: response[0] > 0 ? 0 : 1,
         EM: response[0] > 0 ? `Update ${response[0]} Answer` : 'Answer not found'
      })
   } catch (error) {
      reject(error);
   }
})
export const deleteAnswer = (id) => new Promise(async (resolve, reject) => {
   try {
      const response = await db.Answer.destroy({ where: { id: id } })
      resolve({
         DT: '',
         EC: response > 0 ? 0 : 1,
         EM: response > 0 ? `Delete ${response} answer` : 'answer not found'
      })
   } catch (error) {

      reject(error);
   }
})