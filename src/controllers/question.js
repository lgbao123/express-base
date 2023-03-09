
import { badRequest, internalServerError, logError } from '../middleware/handleError';
import * as services from '../services'
import { checkIncludeString } from '../helper/utils';
import Joi from 'joi';
import { id, name, description, image, type, image_base64, quizId } from '../helper/joiSchema'
// export const getQuiz = async (req, res) => {
//    try {
//       const { order } = req.query;
//       if (order && order.length > 1) if (!checkIncludeString(order[0], Object.keys(db.Quiz.rawAttributes)) || !checkIncludeString(order[1], ['DESC', 'ASC'])) {
//          return badRequest(res, 'Order not valid')
//       }
//       const response = await services.getQuiz(req.query);
//       return res.status(200).json(response)
//    }
//    catch (error) {
//       logError(error, req, res)
//       return internalServerError(req, res)
//    }
// }
export const getQuestionById = async (req, res) => {
   try {
      const schema = Joi.object({ id })
      //validate
      const { error } = schema.validate(req.params, { abortEarly: false })
      const errorMes = error?.details.map(detail => detail.message)
      if (errorMes && errorMes.length) return badRequest(res, errorMes)
      const response = await services.getQuestionById(req.params.id);
      return res.status(200).json(response)
   }
   catch (error) {
      logError(error, req, res)
      return internalServerError(req, res)
   }
}

export const createQuestion = async (req, res) => {
   try {
      const schema = Joi.object({ quizId, description, image })
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

      const response = await services.createQuestion(req.body);
      return res.status(200).json(response)
   }
   catch (error) {
      logError(error, req, res)
      return internalServerError(req, res)
   }
}
export const updateQuestion = async (req, res) => {
   try {
      //validate
      let fileData = '';
      const { image, ...body } = req.body
      const schema = Joi.object({ id, quizId, description, image_base64 })
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
      const response = await services.updateQuestion(req.body);
      return res.status(200).json(response)
   }
   catch (error) {
      logError(error, req, res)
      return internalServerError(req, res)
   }
}

export const deleteQuestion = async (req, res) => {
   try {

      const schema = Joi.object({ id })
      const { error } = schema.validate(req.params, { abortEarly: false })
      // console.log(req.body);
      const errorMes = error?.details.map(detail => detail.message)
      if (errorMes && errorMes.length) return badRequest(res, errorMes)
      const response = await services.deleteQuestion(req.params?.id);
      return res.status(200).json(response)
   }
   catch (error) {
      logError(error, req, res)
      return internalServerError(req, res)
   }
}