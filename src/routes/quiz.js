// import user from '../controllers/user'

import * as quiz from '../controllers/quiz'
import express from 'express'
import { uploads } from '../middleware/uploadImage'
const router = express.Router()


router.get('/', quiz.getQuiz)
router.post('/', uploads.single('image'), quiz.createQuiz)
router.put('/', uploads.single('image'), quiz.updateQuiz)
router.delete('/:id', uploads.single('image'), quiz.deleteQuiz)
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