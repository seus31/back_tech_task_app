const express = require('express')
const router = express.Router()

router.get('/', function (req, res, next) {
    res.render('login', { title: 'ログイン', login: '/login' })
})

router.post('/', function (req, res, next) {
    res.render('login', { title: 'ログインpost', login: '/login' })
})

module.exports = router;
