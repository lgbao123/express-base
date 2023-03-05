import db from '../models'
export const register = () => new Promise((resolve, reject) => {
   try {
      resolve({
         DT: "Register service",
         EC: '0',
         EM: "Call success"
      })
   } catch (error) {
      reject(error);
   }
})