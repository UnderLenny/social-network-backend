import express from 'express'
import { body } from 'express-validator'
import userController from '../controllers/user-controller'
import { authMiddleware } from '../middlewares/auth-middlewares'

const router = express.Router()

router
	.route('/registration')
	.post(
		[body('email').isEmail(), body('password').isLength({ min: 3, max: 32 })],
		userController.registration
	)
router.route('/login').post(userController.login)
router.route('/logout').post(userController.logout)

router.route('/activate/:link').get(userController.activate)
router.route('/refresh').get(userController.refresh)
router.route('/users').get(authMiddleware, userController.getUsers)

export default router
