import { badRequest, internalServerError, logError } from '../middleware/handleError';
import * as services from '../services'
import Joi from 'joi';
export const register = async (req, res) => {
   // console.log(internalServerError())
   try {
      const schema = Joi.object({
         username: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),
         password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')).required()
            .messages({
               "string.pattern.base": `password should have minimum 8 characters`
            }),
         email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required()
      })
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
      const schema = Joi.object({
         password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')).required()
            .messages({
               "string.pattern.base": `password should have minimum 8 characters`
            }),
         email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required()
      })
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