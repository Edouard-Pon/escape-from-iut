const express = require('express')
const router = express.Router()
const uuid = require('uuid')

router.get('/', (req, res) => {
    if (req.cookies['loggedIn'] === undefined) {
        res.render('admin/index', { loggedIn: false })
    } else {
        res.render('admin/index', { loggedIn: true })
    }
})

router.post('/', async (req, res) => {
    const cookiePassword = req.cookies['chefKey']
    const passwordCheck = req.body.passwd

    try {
        if (cookiePassword === passwordCheck) {
            const secretLoggedInKey = uuid.v4()

            let options = {
                httpOnly: true,
                sameSite: true
            }

            res.cookie('loggedIn', secretLoggedInKey, options)
            res.redirect('/admin')
        } else {
            res.redirect('/admin')
        }
    } catch (error) {
        console.log(error)
    }
})

module.exports = router
