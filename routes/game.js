const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    const finalCode = req.cookies['something'].replace(/[;]/g, '')

    if (req.cookies['You_Ended_The_Game!'] !== undefined) {
        res.render('game/index', { valideCode: true, finalCode: finalCode })
    } else {
        res.render('game/index', { valideCode: false, finalCode: '' })
    }
})

router.post('/', async (req, res) => {
    const finalCode = req.body.passwd
    const actualCode = req.cookies['something'].replace(/[;]/g, '')

    try {
        if (finalCode === actualCode) {
            let options = {
                httpOnly: true,
                sameSite: true
            }

            res.cookie('You_Ended_The_Game!', 'Congrats!', options)
            res.render('game/index', { valideCode: true, finalCode: actualCode })
        } else {
            res.render('game/index', { valideCode: false, finalCode: '' })
        }
    } catch (err) {
        console.log(err)
    }
})

module.exports = router
