import db from '../models'
import bcryptjs from 'bcryptjs'
const hashPassword = password => bcryptjs.hashSync(password, bcryptjs.genSaltSync(10))
export const register = ({ email, password }) => new Promise(async (resolve, reject) => {
   try {
      const [row, create] = await db.User.findOrCreate({
         where: { email },
         defaults: {
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