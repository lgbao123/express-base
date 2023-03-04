
const express = require('express')
const router = express.Router()
const { getHomePage, test } = require("../controllers/homeController")

router.get('/', getHomePage);
router.get('/test', test);

module.exports = router;