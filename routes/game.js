const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    if (req.cookies['You_Ended_The_Game!'] !== undefined) {
        const finalCode = req.cookies['something'].replace(/[;]/g, '')
        res.render('game/index', { valideCode: true, finalCode: finalCode })
    } else {
        res.render('game/index', { valideCode: false, finalCode: '' })
    }
})

router.get('/chapter1', (req, res) => {
    res.render('game/chapter1')
})

router.get('/chapter2', (req, res) => {
    if (req.cookies['You_Ended_The_Game!'] !== undefined) {
        const finalCode = req.cookies['something'].replace(/[;]/g, '')
        res.render('game/chapter2', { valideCode: true, finalCode: finalCode })
    } else {
        res.render('game/chapter2', { valideCode: false, finalCode: '' })
    }
})

router.get('/chapter3', (req, res) => {
    if (req.cookies['You_Ended_The_Game!'] !== undefined) {
        const finalCode = req.cookies['something'].replace(/[;]/g, '')
        res.render('game/chapter3', { finalCode: finalCode })
    } else {
        res.render('game/chapter3', { finalCode: '' })
    }
})

router.get('/chapter4', (req, res) => {
    res.render('game/chapter4')
})

router.get('/end', (req, res) => {
    res.render('game/end')
})

router.post('/chapter2', async (req, res) => {
    try {
        if (req.cookies['something'] !== undefined) {
            const finalCode = req.body.passwd
            const actualCode = req.cookies['something'].replace(/[;]/g, '')

            if (finalCode === actualCode) {
                let options = {
                    httpOnly: true,
                    sameSite: true
                }

                res.cookie('You_Ended_The_Game!', 'Congrats!', options)
                res.render('game/chapter2', { valideCode: true, finalCode: actualCode })
            } else {
                res.render('game/chapter2', { valideCode: false, finalCode: 'Wrong Code!' })
            }
        } else {
            res.render('game/chapter2', { valideCode: false, finalCode: '' })
        }
    } catch (err) {
        console.log(err)
    }
})

module.exports = router
