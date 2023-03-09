// import user from '../controllers/user'

import * as quiz from '../controllers/quiz'
import express from 'express'
import { uploads } from '../middleware/uploadImage'
import verifyToken from '../middleware/verifyToken'
const router = express.Router()


router.use(verifyToken)

router.get('/', quiz.getQuiz)
router.get('/:id', quiz.getQuizById)
router.post('/', uploads.single('image'), quiz.createQuiz)
router.put('/', uploads.single('image'), quiz.updateQuiz)
router.delete('/:id', uploads.single('image'), quiz.deleteQuiz)



export default router;