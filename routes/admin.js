const express = require('express')
const router = express.Router()
const uuid = require('uuid')
const CryptoJS = require('crypto-js')

router.get('/', (req, res) => {
    if (req.cookies['loggedIn'] === undefined) {
        res.render('admin/index', { loggedIn: false })
    } else {
        res.render('admin/index', { loggedIn: true })
    }
})

router.get('/chef-vm', (req, res) => {
    if (req.cookies['chefVMPassword'] === undefined) {
        const chefVMPassword = uuid.v4()

        let options = {
            httpOnly: true,
            sameSite: true
        }

        res.cookie('chefVMPassword', chefVMPassword, options)
    }
    if (req.cookies['loggedInChefVM'] === undefined) {
        res.render('admin/chef-vm.ejs', { loggedInChefVM: false, layout: 'layouts/layout-vm.ejs' })
    } else if (req.cookies['secretURL'] === undefined) {
        res.render('admin/chef-vm.ejs', { loggedInChefVM: true, secretURL: '', layout: 'layouts/layout-vm.ejs' })
    } else {
        const secretURL = CryptoJS.SHA1(req.cookies['secretURL'])

        res.render('admin/chef-vm.ejs', { loggedInChefVM: true, secretURL: secretURL, layout: 'layouts/layout-vm.ejs' })
    }
})

router.get('/chef-vm/passwd-vm', (req, res) => {
    const encryptedChefVMPassword = CryptoJS.AES.encrypt(req.cookies['chefVMPassword'], 'chef-vm-password').toString()

    res.render('admin/passwd-vm', { encryptedChefVMPassword: encryptedChefVMPassword })
})

router.get('/:id', (req, res) => {
    const secretURL = CryptoJS.SHA1(req.cookies['secretURL'])
    let codeIUT = ''

    if (req.params.id === secretURL.toString()) {
        if (req.cookies['something'] === undefined) {
            for (let i = 0; i < 7; ++i) {
                codeIUT = codeIUT + Math.floor(Math.random() * 100)
                codeIUT = codeIUT + ';'
            }
            let options = {
                httpOnly: true,
                sameSite: true
            }

            res.cookie('something', codeIUT, options)
        }
        if (req.cookies['something'] !== undefined) {
            codeIUT = req.cookies['something']
        }
        let tmp = codeIUT.split(';')
        res.render('admin/secret-page.ejs', { codeIUT: tmp })
    } else {
        res.redirect('/admin')
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

router.post('/chef-vm', async (req, res) => {
    try {
        if (req.cookies['loggedInChefVM'] === undefined) {
            const chefVMPassword = req.cookies['chefVMPassword']
            const passwordCheck = CryptoJS.AES.decrypt(req.body.passwd, 'chef-vm-password').toString(CryptoJS.enc.Utf8)

            if (chefVMPassword === passwordCheck) {
                const secretLoggedInKey = uuid.v4()

                let options = {
                    httpOnly: true,
                    sameSite: true
                }

                res.cookie('loggedInChefVM', secretLoggedInKey, options)
                res.redirect('/admin/chef-vm')
            }
        } else if (req.cookies['loggedInChefVM'] !== undefined && req.cookies['secretURL'] === undefined) {
            const secretURL = uuid.v4()

            let options = {
                httpOnly: true,
                sameSite: true
            }

            res.cookie('secretURL', secretURL, options)
            res.redirect('/admin/chef-vm')
        } else {
            res.redirect('/admin/chef-vm')
        }
    } catch (error) {
        console.log(error)
    }
})

module.exports = router
