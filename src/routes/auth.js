import * as controllers from '../controllers/'
import express from 'express'
import verifyToken from '../middleware/verifyToken'
import { uploads } from '../middleware/uploadImage'



const router = express.Router()


router.post('/login', controllers.login)
router.post('/register', controllers.register)
router.post('/refresh-token', controllers.refreshToken)
router.post('/logout', controllers.logOut)

router.use(verifyToken)
router.post('/update-profile', uploads.single('userImage'), controllers.updateProfile)





export default router;