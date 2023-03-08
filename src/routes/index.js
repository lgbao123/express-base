
// const user = require('./user')
import { notFound } from '../middleware/handleError'
import user from './user'
import auth from './auth'
import quiz from './quiz'
const initRoutes = (app) => {
   app.use('/api/v1/participant', user)
   app.use('/api/v1/auth', auth)
   app.use('/api/v1/quiz', quiz)

   return app.use(notFound)
}
export default initRoutes
