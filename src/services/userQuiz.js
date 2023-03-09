import { Op } from 'sequelize';
import { cloudinary } from '../middleware/uploadImage';
import db from '../models'
import _ from 'lodash'
require('dotenv').config()

export const getQuizByUser = (id) => new Promise(async (resolve, reject) => {
   try {
      // const query = { id }
      const rows = await db.UserQuiz.findAll({
         attributes: { exclude: ['createdAt', 'updatedAt'] },
         where: { userId: id },
         include: [
            { model: db.Quiz, required: true }
         ],
         raw: true,
         nest: true,

      })
      let quizzes = []
      if (rows) { quizzes = rows.map(row => row.Quiz) }
      resolve({
         DT: rows ? quizzes : '',
         EC: rows ? 0 : 1,
         EM: rows ? "Success" : "Data not found"
      })
   } catch (error) {
      reject(error);
   }
})
export const assignQuizToUser = ({ quizId, userId }) => new Promise(async (resolve, reject) => {
   try {
      // const query = { id }
      const countUser = await db.User.count({ where: { id: userId } })
      const countQuiz = await db.Quiz.count({ where: { id: quizId } })
      console.log(countQuiz);
      console.log(countUser);
      if (!countQuiz || !countUser) {
         return resolve({
            DT: '',
            EC: 1,
            EM: "User or quiz is not in database"
         })
      }
      const [row, created] = await db.UserQuiz.findOrCreate({
         where: { quizId, userId },
         defaults: { quizId, userId },
         raw: true,
         nest: true,
      })
      resolve({
         DT: '',
         EC: created ? 0 : 1,
         EM: created ? "Success" : "You have already assigned user"
      })
   } catch (error) {
      reject(error);
   }
})
export const getQuizWithQA = (id) => new Promise(async (resolve, reject) => {
   try {
      // const query = { id }

      const rows = await db.Quiz.findAll({
         attributes: [['id', 'quizId']],

         where: { id },
         include: [
            {
               model: db.Question, as: 'qa', required: true,
               attributes: ['id', 'description', ['image', 'imageFile']],
               include: {
                  model: db.Answer, as: 'answers', required: true,
                  attributes: ['id', 'description', 'isCorrect'],
               }
            },
         ],
         raw: true,
         nest: true,
      })

      const kq = _.chain(rows)
         .groupBy(item => item.quizId)
         .map((item) => {
            const quiz = {}
            quiz.quizId = item[0].quizId
            quiz.qa = item.map((ques) => ques.qa)
            let final = _.chain(quiz.qa)
               .groupBy(ques => ques.id)
               .map(item => {
                  const listAns = item.map(ans => ans.answers)
                  return { ...item[0], answers: listAns }
               })

            // console.log('check final', final);
            return { ...item[0], qa: final }
         })
         .value()

      resolve({
         DT: rows[0] ? kq[0] : '',
         EC: rows[0] ? 0 : 1,
         EM: rows[0] ? "Success" : "Data not found"
      })
   } catch (error) {
      reject(error);
   }
})


export const upSertQuizQA = (body) => new Promise(async (resolve, reject) => {
   try {
      // console.log(body);
      let idQuesDB = await db.Question.findAll({ where: { quizId: body.quizId }, raw: true }) || []
      idQuesDB = idQuesDB.map(item => item.id)
      // console.log(idQuesDB);
      // const indexQ = idQuesDB.findIndex(1)
      // console.log(indexQ);
      if (body?.questions[0]?.id && body?.questions[0]?.answers[0]?.id) {
         for (const question of body.questions) {
            const { description, imageFile: image } = question
            const query = { description, image, quizId: body.quizId };
            const indexQ = idQuesDB.indexOf(+question.id)
            if (indexQ > -1) {
               query.id = +question.id
               idQuesDB.splice(indexQ, 1)
            }
            // console.log('check query question :', query);
            const [ques, created] = await db.Question.upsert({ ...query })
            let idAnsDB = []
            if (indexQ > -1) {
               idAnsDB = await db.Answer.findAll({ where: { questionId: +question.id }, raw: true }) || []
               idAnsDB = idAnsDB.map(item => item.id)
            }
            for (const answer of question.answers) {
               const { id: idA, ...queryA } = answer
               const indexA = idAnsDB.indexOf(+idA)
               if (indexA > -1) {
                  queryA.id = +idA
                  idAnsDB.splice(indexA, 1)
               }
               console.log('check query answer :', { ...queryA });
               const [city, created] = await db.Answer.upsert({ ...queryA, questionId: ques.id })
            }
            // console.log('check Answer DB id :', idAnsDB);
            for (const idRA of idAnsDB) {
               await db.Answer.destroy({ where: { id: idRA } })
            }

         }
         // console.log('check Question DB id :', idQuesDB);
         for (const idRQ of idQuesDB) {
            const ques = await db.Question.findOne({ where: { id: idRQ } })
            if (ques) ques.destroy();
         }

      } else {
         return resolve({
            DT: '',
            EC: 1,
            EM: "Invalid format"
         })
      }

      // const row = await db.Quiz.create({
      //    ...body
      // })
      resolve({
         DT: '',
         EC: 1,
         EM: "Create quiz success"
      })

   } catch (error) {
      reject(error);
   }
})


// export const updateQuiz = ({ id, ...body }) => new Promise(async (resolve, reject) => {
//    try {
//       // console.log(body);
//       const response = await db.Quiz.update({
//          ...body,
//       }, { where: { id } })
//       // console.log(fileData);
//       resolve({
//          DT: '',
//          EC: response[0] > 0 ? 0 : 1,
//          EM: response[0] > 0 ? `Update ${response[0]} Quiz` : 'quizId not found'
//       })
//    } catch (error) {
//       reject(error);
//    }
// })
// export const deleteQuiz = (id) => new Promise(async (resolve, reject) => {
//    try {
//       const response = await db.Quiz.destroy({ where: { id: id } })
//       resolve({
//          DT: '',
//          EC: response > 0 ? 0 : 1,
//          EM: response > 0 ? `Delete ${response} quiz` : 'quizId not found'
//       })
//    } catch (error) {

//       reject(error);
//    }
// })