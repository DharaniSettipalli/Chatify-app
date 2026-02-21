import express from 'express'
import { login, logout, signup, updateProfile } from '../Controllers/authControllers.js'
import { protectRoute } from '../middlewares/middleware.js'
import { arcjetProtection } from '../middlewares/arcjet.middleware.js'


const router = express.Router()

router.use(arcjetProtection)


router.post('/signup', signup)

router.post('/login', login)

router.post('/logout', logout)

router.put('/updateProfile', protectRoute, updateProfile)

router.get('/check', protectRoute, (req, res) => {
    res.status(200).json(req.user)
})

export default router