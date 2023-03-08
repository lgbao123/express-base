import { Op } from 'sequelize';
import { getPublicId, hashPassword } from '../helper/utils';
import { cloudinary } from '../middleware/uploadImage';

import db from '../models'

require('dotenv').config()

export const getUser = ({ page: pageU, limit: limitU, order: orderU, username: usernameU }) => new Promise(async (resolve, reject) => {
   try {

      let totalRows = await db.User.count();
      const limit = +limitU || totalRows;
      let totalPages = Math.ceil(totalRows / limit) || 0
      const page = (+pageU > 0 && +pageU <= totalPages) ? +pageU : 1;
      const offset = (page - 1) * limit;
      const order = orderU ? [orderU] : [['id', 'DESC']];
      const queries = { limit, offset, order };
      const username = usernameU || '';
      const query = {}
      query.username = { [Op.substring]: username }

      const { count, rows } = await db.User.findAndCountAll({
         attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
         where: { ...query },
         ...queries,
         raw: true
      })
      totalRows = count
      console.log(count);
      totalPages = Math.ceil(totalRows / limit) || 0
      // console.log('>>>> Query :', query);
      // console.log('>>>> queries :', queries);
      // console.log('>>>> countUser :', countUser);
      // console.log('>>>> totalPage :', totalPage);
      resolve({
         DT: count ? { totalRows, totalPages, users: rows } : '',
         EC: count ? 0 : 1,
         EM: count ? "Success" : "Data not found"
      })
   } catch (error) {
      reject(error);
   }
})

export const createUser = (body, fileData) => new Promise(async (resolve, reject) => {
   try {
      // console.log(body);
      const { email } = body
      const response = await db.User.findOrCreate({

         where: { email },
         defaults: { ...body, password: hashPassword(body.password), image: fileData?.url },
         raw: true
      })

      resolve({
         DT: '',
         EC: response[1] ? 0 : 1,
         EM: response[1] ? "Create success" : "Email has exsist"
      })
      if (fileData && !response[1]) cloudinary.v2.uploader.destroy(fileData.public_id)
   } catch (error) {
      if (fileData) cloudinary.v2.uploader.destroy(fileData.public_id)
      reject(error);
   }
})


export const updateUser = ({ id, ...body }, fileData) => new Promise(async (resolve, reject) => {
   try {
      // console.log(body);
      const user = await db.User.findOne({ where: { id } })
      if (user && user.image) cloudinary.v2.uploader.destroy(getPublicId(user.image))
      if (fileData) {
         // console.log(fileData.url)
         body.image = fileData.url
      }
      const response = await db.User.update({
         ...body,
      }, { where: { id } })
      // console.log(fileData);
      resolve({
         DT: '',
         EC: response[0] > 0 ? 0 : 1,
         EM: response[0] > 0 ? `Update ${response[0]} user` : 'userid not found'
      })
      if (!response[0]) cloudinary.v2.uploader.destroy(fileData.public_id)
   } catch (error) {
      if (fileData) cloudinary.v2.uploader.destroy(fileData.public_id)
      reject(error);
   }
})
export const deleteUser = (id) => new Promise(async (resolve, reject) => {
   try {
      console.log(id);
      const user = await db.User.findOne({ where: { id: id } })
      if (user && user.image) cloudinary.v2.uploader.destroy(getPublicId(user.image))
      const response = await db.User.destroy({ where: { id: id } })
      console.log(response);
      resolve({
         DT: '',
         EC: response > 0 ? 0 : 1,
         EM: response > 0 ? `Delete ${response} user` : 'userid not found'
      })
   } catch (error) {

      reject(error);
   }
})