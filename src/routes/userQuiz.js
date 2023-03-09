// import user from '../controllers/user'

import * as userQuiz from '../controllers/userQuiz'
import express from 'express'
import { uploads } from '../middleware/uploadImage'
import verifyToken from '../middleware/verifyToken'
const router = express.Router()


router.use(verifyToken)
router.get('/quiz-by-participant', userQuiz.getQuizByUser)
router.post('/quiz-assign-to-user', userQuiz.assignQuizToUser)
router.get('/quiz-with-qa/:id', userQuiz.getQuizWithQA)
router.post('/quiz-upsert-qa', express.raw({ type: 'application/json' }), userQuiz.upSertQuizQA)
// router.get('/', quiz.getQuiz)
// router.get('/:id', quiz.getQuizById)
// router.post('/', uploads.single('image'), quiz.createQuiz)
// router.put('/', uploads.single('image'), quiz.updateQuiz)
// router.delete('/:id', uploads.single('image'), quiz.deleteQuiz)
// router.put('/', uploads.single('image'), quiz.updateUser)
// router.delete('/', quiz.deleteUser)
// router.put('/', user.updateUser)
// router.put('/', (req, res, next) => {
//    console.log(req.body);
//    next()
// }, (req, res) => {
//    const { id } = req.body;
//    console.log(id);
//    res.json('okla')
// })

// module.exports = router
export default router;