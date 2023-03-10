

import { badRequest, internalServerError, logError } from '../middleware/handleError';
import * as services from '../services'
import db from '../models';
import { checkIncludeString } from '../helper/utils';
import Joi from 'joi';
import { email, username, password, role, id, userId, quizId, image, submitFormat, upsertFormat } from '../helper/joiSchema'
import { upload, uploadCloud } from '../middleware/uploadImage';
export const getQuizByUser = async (req, res) => {

   try {
      const response = await services.getQuizByUser(req.user.id);
      return res.status(200).json(response)
   }
   catch (error) {
      logError(error, req, res)
      return internalServerError(req, res)
   }
}
export const assignQuizToUser = async (req, res) => {

   try {
      const schema = Joi.object({ userId, quizId })
      //validate
      const { error } = schema.validate(req.body, { abortEarly: false })
      const errorMes = error?.details.map(detail => detail.message)
      if (errorMes && errorMes.length) return badRequest(res, errorMes)
      const response = await services.assignQuizToUser(req.body);
      return res.status(200).json(response)
   }
   catch (error) {
      logError(error, req, res)
      return internalServerError(req, res)
   }
}
export const getQuizWithQA = async (req, res) => {

   try {
      const schema = Joi.object({ id })
      //validate
      const { error } = schema.validate(req.params, { abortEarly: false })
      const errorMes = error?.details.map(detail => detail.message)
      if (errorMes && errorMes.length) return badRequest(res, errorMes)
      const response = await services.getQuizWithQA(req.params.id);
      return res.status(200).json(response)
   }
   catch (error) {
      logError(error, req, res)
      return internalServerError(req, res)
   }
}
export const upSertQuizQA = async (req, res) => {

   try {
      const schema = Joi.object({ upsertFormat })
      // validate
      const { error } = schema.validate({ upsertFormat: req.body }, { abortEarly: false })
      const errorMes = error?.details.map(detail => detail.message)
      if (errorMes && errorMes.length) return badRequest(res, errorMes)
      const response = await services.upSertQuizQA(req.body);

      return res.status(200).json(response)
   }
   catch (error) {
      logError(error, req, res)
      return internalServerError(req, res)
   }
}

export const submitQuiz = async (req, res) => {
   try {

      // validate

      const schema = Joi.object({ submitFormat })
      const { error } = schema.validate({ submitFormat: req.body }
         , { abortEarly: false })

      const errorMes = error?.details.map(detail => detail.message)
      if (errorMes && errorMes.length) return badRequest(res, errorMes)
      const response = await services.submitQuiz(req.body, req?.user?.id);
      return res.status(200).json(response)
   }
   catch (error) {
      logError(error, req, res)
      return internalServerError(req, res)
   }
}
