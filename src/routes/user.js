// import user from '../controllers/user'

import * as user from '../controllers/user'
import express from 'express'
const router = express.Router()


router.get('/', user.getUsers)

// module.exports = router
export default router;