
import { badRequest, internalServerError, logError } from '../middleware/handleError';
import * as services from '../services'
import db from '../models';
import { checkIncludeString } from '../helper/utils';
import Joi from 'joi';
import { id, name, description, image, type, image_base64 } from '../helper/joiSchema'
import { upload, uploadCloud } from '../middleware/uploadImage';
export const getQuiz = async (req, res) => {
   try {
      const { order } = req.query;
      if (order && order.length > 1) if (!checkIncludeString(order[0], Object.keys(db.Quiz.rawAttributes)) || !checkIncludeString(order[1], ['DESC', 'ASC'])) {
         return badRequest(res, 'Order not valid')
      }
      const response = await services.getQuiz(req.query);
      return res.status(200).json(response)
   }
   catch (error) {
      logError(error, req, res)
      return internalServerError(req, res)
   }
}
export const createQuiz = async (req, res) => {
   try {

      let fileData = ''
      const schema = Joi.object({ name, description, image, type })
      //validate
      const { error } = schema.validate(req.body, { abortEarly: false })
      const errorMes = error?.details.map(detail => detail.message)
      if (errorMes && errorMes.length) return badRequest(res, errorMes)
      //check img file
      if (req.fileValidationError) return badRequest(res, 'Please upload file image')
      if (req.file) {
         // fileData = await uploadCloud(req)
         req.body.image = req?.file?.buffer?.toString('base64')
      }

      const response = await services.createQuiz(req.body, fileData);
      return res.status(200).json(response)
   }
   catch (error) {
      logError(error, req, res)
      return internalServerError(req, res)
   }
}
export const updateQuiz = async (req, res) => {
   try {
      //validate
      let fileData = '';
      const { image, ...body } = req.body
      const schema = Joi.object({ id, name, description, image_base64, type })
      const { error } = schema.validate({ ...body, image_base64: image }
         , { abortEarly: false })
      //check img file
      const errorMes = error?.details.map(detail => detail.message)
      if (errorMes && errorMes.length) return badRequest(res, errorMes)
      // check img file
      if (req.fileValidationError) return badRequest(res, 'Please upload file image')
      if (req.file) {
         req.body.image = req?.file?.buffer?.toString('base64')
      }
      const response = await services.updateQuiz(req.body);
      return res.status(200).json(response)
   }
   catch (error) {
      logError(error, req, res)
      return internalServerError(req, res)
   }
}

export const deleteQuiz = async (req, res) => {
   try {

      const schema = Joi.object({ id })
      const { error } = schema.validate(req.params, { abortEarly: false })
      // console.log(req.body);
      const errorMes = error?.details.map(detail => detail.message)
      if (errorMes && errorMes.length) return badRequest(res, errorMes)
      const response = await services.deleteQuiz(req.params?.id);
      return res.status(200).json(response)
   }
   catch (error) {
      logError(error, req, res)
      return internalServerError(req, res)
   }
}