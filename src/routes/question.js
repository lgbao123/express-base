// import user from '../controllers/user'

import * as question from '../controllers/question'
import express from 'express'
import { uploads } from '../middleware/uploadImage'
import verifyToken from '../middleware/verifyToken'
import { isAdmin } from '../middleware/verifyRole'
const router = express.Router()


router.use(verifyToken)

// router.get('/', quiz.getQuiz)
router.get('/:id', question.getQuestionById)
router.use(isAdmin)
router.post('/', uploads.single('image'), question.createQuestion)
router.put('/', uploads.single('image'), question.updateQuestion)
router.delete('/:id', question.deleteQuestion)



export default router;