import express from 'express'
import userController from '../controllers/user-controller'

const router = express.Router()

router.route('/registration').post(userController.registration)
router.route('/login').post(userController.login)
router.route('/logout').post(userController.logout)

router.route('/activate/:link').get(userController.activate)
router.route('/refresh').get(userController.refresh)
router.route('/users').get(userController.getUsers)

export default router
