// import user from '../controllers/user'

import * as answer from '../controllers/answer'
import express from 'express'
import { uploads } from '../middleware/uploadImage'
import verifyToken from '../middleware/verifyToken'
const router = express.Router()


router.use(verifyToken)

// router.get('/', quiz.getQuiz)
// router.get('/:id', question.getQuestionById)
router.post('/', answer.createAnswer)
router.put('/', answer.updateAnswer)
router.delete('/:id', answer.deleteAnswer)



export default router;