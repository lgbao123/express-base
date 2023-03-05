
const express = require('express')
const router = express.Router()
const { getHomePage, getCreatePage, postCreateUser } = require("../controllers/homeController")

router.get('/', getHomePage);
// router.get('/create', getCreatePage);
// router.post('/create-user', postCreateUser);

module.exports = router;