
import { badRequest, internalServerError, logError } from '../middleware/handleError';
import * as services from '../services'
import db from '../models';
import { checkIncludeString } from '../helper/utils';
import Joi from 'joi';
import { email, username, password, role, id, image, current_password, new_password } from '../helper/joiSchema'
import { upload, uploadCloud } from '../middleware/uploadImage';
export const getUsers = async (req, res) => {
   try {
      const { order } = req.query;
      if (order && order.length > 1) if (!checkIncludeString(order[0], Object.keys(db.User.rawAttributes)) || !checkIncludeString(order[1], ['DESC', 'ASC'])) {
         return badRequest(res, 'Order not valid')
      }
      const response = await services.getUser(req.query);
      return res.status(200).json(response)
   }
   catch (error) {
      logError(error, req, res)
      return internalServerError(req, res)
   }
}
export const createUser = async (req, res) => {
   try {
      // console.log(req.body);
      // console.log(res.body)
      // console.log(req.fileValidationError);
      let fileData = ''
      const schema = Joi.object({ email, username, role, password, image })
      const { error } = schema.validate(req.body, { abortEarly: false })
      const errorMes = error?.details.map(detail => detail.message)
      if (errorMes && errorMes.length) return badRequest(res, errorMes)
      //check img file
      if (req.fileValidationError) return badRequest(res, 'Please upload file image')
      if (req.file) {
         fileData = await uploadCloud(req)
      }
      const response = await services.createUser(req.body, fileData);
      return res.status(200).json(response)
   }
   catch (error) {
      logError(error, req, res)
      return internalServerError(req, res)
   }
}
export const updateUser = async (req, res) => {
   try {
      // console.log(res.body)
      // console.log(req.fileValidationError);
      let fileData = ''
      const schema = Joi.object({ username, role, id, image })
      const { error } = schema.validate(req.body, { abortEarly: false })
      // console.log(req.body);
      const errorMes = error?.details.map(detail => detail.message)
      if (errorMes && errorMes.length) return badRequest(res, errorMes)
      // check img file
      if (req.fileValidationError) return badRequest(res, 'Please upload file image')
      if (req.file) {
         fileData = await uploadCloud(req)
      }
      const response = await services.updateUser(req.body, fileData);
      return res.status(200).json(response)
   }
   catch (error) {
      logError(error, req, res)
      return internalServerError(req, res)
   }
}

export const deleteUser = async (req, res) => {
   try {

      const schema = Joi.object({ id })
      const { error } = schema.validate(req.body, { abortEarly: false })
      // console.log(req.body);
      const errorMes = error?.details.map(detail => detail.message)
      if (errorMes && errorMes.length) return badRequest(res, errorMes)
      const response = await services.deleteUser(req.body?.id);
      return res.status(200).json(response)
   }
   catch (error) {
      logError(error, req, res)
      return internalServerError(req, res)
   }
}

export const changePassword = async (req, res) => {
   try {

      const schema = Joi.object({ new_password, current_password })
      const { error } = schema.validate(req.body, { abortEarly: false })
      // console.log(req.body);
      const errorMes = error?.details.map(detail => detail.message)
      if (errorMes && errorMes.length) return badRequest(res, errorMes)

      if (req?.body?.new_password == req?.body?.current_password) return badRequest(res, `new password is not same password `)
      const response = await services.changePassword(req?.body?.current_password, req?.body?.new_password, req?.user?.id);
      return res.status(200).json(response)
   }
   catch (error) {
      logError(error, req, res)
      return internalServerError(req, res)
   }
}
export const getHistory = async (req, res) => {
   try {

      const response = await services.getHistory(req?.user?.id);
      return res.status(200).json(response)
   }
   catch (error) {
      logError(error, req, res)
      return internalServerError(req, res)
   }
}

export const getDashboard = async (req, res) => {
   try {
      const response = await services.getDashboard(req?.user?.id);
      return res.status(200).json(response)
   }
   catch (error) {
      logError(error, req, res)
      return internalServerError(req, res)
   }
}