import { badRequest, internalServerError, logError, unAuth } from '../middleware/handleError';
import { username, email, password, image, rf_token } from '../helper/joiSchema';
import * as services from '../services'
import Joi from 'joi';
import { uploadCloud } from '../middleware/uploadImage';
import jwt, { TokenExpiredError } from "jsonwebtoken";
require('dotenv').config()
export const register = async (req, res) => {
   // console.log(internalServerError())
   try {
      const schema = Joi.object({ email, username, password })
      // const { email, password } = req.body;
      const { error, value } = schema.validate(req.body, { abortEarly: false })
      const errorMes = error?.details.map(detail => detail.message)
      if (errorMes && errorMes.length) return badRequest(res, errorMes)

      const response = await services.register(req.body);
      return res.status(200).json(response)

   }
   catch (error) {
      logError(error, req, res)
      return internalServerError(req, res)
   }
}
export const login = async (req, res) => {
   // console.log(internalServerError())
   try {
      const schema = Joi.object({ password, email })
      // const { email, password } = req.body;
      const { error, value } = schema.validate(req.body, { abortEarly: false })
      const errorMes = error?.details.map(detail => detail.message)
      if (errorMes && errorMes.length) return badRequest(res, errorMes)

      const response = await services.login(req.body);
      return res.status(200).json(response)

   }
   catch (error) {
      logError(error, req, res)
      return internalServerError(req, res)
   }
}

export const updateProfile = async (req, res) => {
   try {
      let fileData = ''
      const schema = Joi.object({ username, image })
      // const { email, password } = req.body;
      const { error, value } = schema.validate({
         username: req.body?.username, image: req.body?.userImage
      }, { abortEarly: false })
      const errorMes = error?.details.map(detail => detail.message)
      if (errorMes && errorMes.length) return badRequest(res, errorMes)

      if (req.fileValidationError) return badRequest(res, 'Please upload file image')
      if (req.file) {
         fileData = await uploadCloud(req)
      }
      const response = await services.updateProfile(req?.user?.email, req.body, fileData);
      return res.status(200).json(response)

   }
   catch (error) {
      logError(error, req, res)
      return internalServerError(req, res)
   }
}
export const refreshToken = async (req, res) => {
   try {
      const schema = Joi.object({ email, rf_token })
      // const { email, password } = req.body;
      const { error, value } = schema.validate({
         email: req.body?.email, rf_token: req.body?.refresh_token
      }, { abortEarly: false })
      const errorMes = error?.details.map(detail => detail.message)
      if (errorMes && errorMes.length) return badRequest(res, errorMes)
      // validate token 
      const response = await services.refreshToken(req.body);
      return res.status(200).json(response)

   }
   catch (error) {
      logError(error, req, res)
      return internalServerError(req, res)
   }
}
export const logOut = async (req, res) => {
   try {
      const schema = Joi.object({ email, rf_token })
      // const { email, password } = req.body;
      const { error, value } = schema.validate({
         email: req.body?.email, rf_token: req.body?.refresh_token
      }, { abortEarly: false })
      const errorMes = error?.details.map(detail => detail.message)
      if (errorMes && errorMes.length) return badRequest(res, errorMes)
      // validate token 

      const response = await services.logOut(req.body);
      return res.status(200).json(response)

   }
   catch (error) {
      logError(error, req, res)
      return internalServerError(req, res)
   }
}