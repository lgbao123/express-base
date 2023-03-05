
// const user = require('./user')
import user from './user'
const initRoutes = (app) => {
   app.use('/api/v1/user', user)

   return app.use('/', (req, res) => {
      return res.send('SERVER ON')
   });
}
export default initRoutes
