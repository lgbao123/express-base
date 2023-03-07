import bcryptjs from 'bcryptjs'
require('dotenv').config()

export const hashPassword = password => bcryptjs.hashSync(password, bcryptjs.genSaltSync(10))
