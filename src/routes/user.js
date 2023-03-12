// import user from '../controllers/user'

import * as user from '../controllers/user'
import express from 'express'
import { uploads } from '../middleware/uploadImage'
import verifyToken from '../middleware/verifyToken'
import { isAdmin } from '../middleware/verifyRole'
const router = express.Router()

router.use(verifyToken)
router.post('/change-password', user.changePassword)
router.get('/overview', user.getDashboard)
router.get('/history', user.getHistory)
router.get('/', user.getUsers)
router.put('/', uploads.single('image'), user.updateUser)
router.use(isAdmin)
router.post('/', uploads.single('image'), user.createUser)
router.delete('/', user.deleteUser)

export default router;