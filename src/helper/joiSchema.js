import Joi from 'joi';

export const username = Joi.string().min(3).max(30).required();
export const password = Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')).required().messages({
   "string.pattern.base": `password should have minimum 8 characters`
});
export const email = Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required();
export const role = Joi.string().valid("ADMIN", "USER")
export const id = Joi.string().required();
export const image = Joi.string().allow('', null);
export const image_base64 = Joi.string().allow('', null).base64();
export const rf_token = Joi.string().required();

export const name = Joi.string().min(3).max(30).required();
export const description = Joi.string()
export const type = Joi.string().valid("EASY", "HARD", "MEDIUM")



