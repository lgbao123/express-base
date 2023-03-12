// import user from '../controllers/user'

import * as userQuiz from '../controllers/userQuiz'
import express from 'express'
import { uploads } from '../middleware/uploadImage'
import verifyToken from '../middleware/verifyToken'
import { isAdmin } from '../middleware/verifyRole'
const router = express.Router()


router.use(verifyToken)
router.get('/quiz-by-participant', userQuiz.getQuizByUser)
router.post('/quiz-assign-to-user', userQuiz.assignQuizToUser)
router.get('/quiz-with-qa/:id', userQuiz.getQuizWithQA)
router.post('/quiz-upsert-qa', isAdmin, express.raw({ type: 'application/json' }), userQuiz.upSertQuizQA)
router.post('/quiz-submit', userQuiz.submitQuiz)

export default router;