import { Op } from 'sequelize';
import db from '../models'
import _ from 'lodash'
import { array } from 'joi';
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
export const getQuizWithQA = (id, raw = false) => new Promise(async (resolve, reject) => {
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
               .value()

            // console.log('check final', final);
            return { ...item[0], qa: final }
         })
         .value()

      if (raw) return resolve(kq[0])
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
      let idQuesDB = await db.Question.findAll({ where: { quizId: +body.quizId }, raw: true }) || []
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
               // console.log('check query answer :', { ...queryA });
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


export const submitQuiz = (body, userId) => new Promise(async (resolve, reject) => {
   try {
      const quiz = await getQuizWithQA(body.quizId, true)
      let totalCorrect = 0
      let totalQuestion = 0
      if (quiz) totalQuestion = quiz?.qa?.length
      quiz && body.answers.forEach((question) => {
         // console.log(test);
         const quesDB = quiz.qa.find(item => item.id === +question.questionId)
         let ansDB = quesDB.answers.filter(answer => answer.isCorrect == true)
         ansDB = ansDB.map(ans => ans.id)
         question.dbAnswerId = ansDB || []
         if (question.userAnswerId.length === question.dbAnswerId.length) {

            // console.log(question.userAnswerId);
            // console.log(question.dbAnswerId);
            const correctFilter = question.userAnswerId.filter(e => ansDB.indexOf(e) !== -1);
            // console.log(correctFilter);
            if (correctFilter.length === question.userAnswerId.length) totalCorrect = totalCorrect + 1
         }
      })
      resolve({
         DT: totalQuestion > 0 ? { "countCorrect": totalCorrect, "countTotal": totalQuestion } : '',
         EC: totalQuestion > 0 ? 0 : 1,
         EM: totalQuestion > 0 ? `Success` : 'Question not found in quiz'
      })

      db.History.create({ quizId: body?.quizId, userId, totalCorrect, totalQuestion })

   } catch (error) {

      reject(error);
   }
})