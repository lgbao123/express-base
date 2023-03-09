
// const user = require('./user')
import { notFound } from '../middleware/handleError'
import user from './user'
import auth from './auth'
import quiz from './quiz'
import userQuiz from './userQuiz'
import question from './question'
import answer from './answer'
const initRoutes = (app) => {
   app.use('/api/v1/participant', user)
   app.use('/api/v1/auth', auth)
   app.use('/api/v1/quiz', quiz)
   app.use('/api/v1/', userQuiz)
   app.use('/api/v1/question', question)
   app.use('/api/v1/answer', answer)

   return app.use(notFound)
}
export default initRoutes
