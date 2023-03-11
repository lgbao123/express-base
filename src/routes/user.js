// import user from '../controllers/user'

import * as user from '../controllers/user'
import express from 'express'
import { uploads } from '../middleware/uploadImage'
import verifyToken from '../middleware/verifyToken'
const router = express.Router()

router.use(verifyToken)
router.get('/', user.getUsers)
router.post('/', uploads.single('image'), user.createUser)
router.put('/', uploads.single('image'), user.updateUser)
router.delete('/', user.deleteUser)
router.post('/change-password', user.changePassword)
router.get('/overview', user.getDashboard)
router.get('/history', user.getHistory)
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