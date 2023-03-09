
import { badRequest, internalServerError, logError } from '../middleware/handleError';
import * as services from '../services'
import { checkIncludeString } from '../helper/utils';
import Joi from 'joi';
import { id, name, description, image, image_base64, questionId, correct_answer } from '../helper/joiSchema'



export const createAnswer = async (req, res) => {
   try {

      const schema = Joi.object({ questionId, description, correct_answer })
      //validate
      const { error } = schema.validate(req.body, { abortEarly: false })
      const errorMes = error?.details.map(detail => detail.message)
      if (errorMes && errorMes.length) return badRequest(res, errorMes)
      const response = await services.createAnswer(req.body);
      return res.status(200).json(response)
   }
   catch (error) {
      logError(error, req, res)
      return internalServerError(req, res)
   }
}
export const updateAnswer = async (req, res) => {
   try {

      //validate
      const { image, ...body } = req.body
      const schema = Joi.object({ id, questionId, description, correct_answer })
      const { error } = schema.validate({ ...body }
         , { abortEarly: false })
      //check img file
      const errorMes = error?.details.map(detail => detail.message)
      if (errorMes && errorMes.length) return badRequest(res, errorMes)
      const response = await services.updateAnswer(req.body);
      return res.status(200).json(response)
   }
   catch (error) {
      logError(error, req, res)
      return internalServerError(req, res)
   }
}

export const deleteAnswer = async (req, res) => {
   try {

      const schema = Joi.object({ id })
      const { error } = schema.validate(req.params, { abortEarly: false })
      // console.log(req.body);
      const errorMes = error?.details.map(detail => detail.message)
      if (errorMes && errorMes.length) return badRequest(res, errorMes)
      const response = await services.deleteAnswer(req.params?.id);
      return res.status(200).json(response)
   }
   catch (error) {
      logError(error, req, res)
      return internalServerError(req, res)
   }
}