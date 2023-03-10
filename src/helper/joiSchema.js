import Joi from 'joi';

export const username = Joi.string().min(3).max(30).required();
export const password = Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')).required().messages({
   "string.pattern.base": `password should have minimum 8 characters`
});
export const email = Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required();
export const role = Joi.string().valid("ADMIN", "USER")
export const id = Joi.string().required();
export const userId = Joi.number().required();
export const quizId = Joi.number().required();
export const questionId = Joi.number().required();
export const image = Joi.string().allow('', null);
export const image_base64 = Joi.string().allow('', null).base64();
export const time = Joi.number();
export const rf_token = Joi.string().required();

export const name = Joi.string().min(3).max(30).required();
export const description = Joi.string()
export const type = Joi.string().valid("EASY", "HARD", "MEDIUM")
// export const correct_answer = Joi.string().valid("true", "false")
export const correct_answer = Joi.boolean()

export const submitFormat = Joi.object().keys({
   quizId: Joi.number().required(),
   answers: Joi.array().items(
      Joi.object().keys({
         questionId: Joi.number().required(),
         userAnswerId: Joi.array().items(Joi.number())
      })
   )
})

export const upsertFormat = Joi.object().keys({
   quizId: Joi.number().required(),
   questions: Joi.array().items(
      Joi.object().keys({
         id: Joi.string().required(),
         description: Joi.string(),
         imageFile: Joi.string(),
         answers: Joi.array().items(
            Joi.object().keys({
               id: Joi.string().required(),
               description: Joi.string(),
               isCorrect: Joi.boolean()
            })
         )
      })
   )
})





