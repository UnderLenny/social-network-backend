import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { ApiError } from '../exceptions/api-error'
import userService from '../services/user-service'

class UserController {
	async registration(req: Request, res: Response, next: NextFunction) {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
			}
			const { email, password, name, surname } = req.body
			const userData = await userService.registration(
				email,
				password,
				name,
				surname
			)
			res.cookie('refreshToken', userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			})
			return res.json(userData)
		} catch (err) {
			next(err)
		}
	}
	async login(req: Request, res: Response, next: NextFunction) {
		try {
			const { email, password } = req.body
			const userData = await userService.login(email, password)
			res.cookie('refreshToken', userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			})
			return res.json(userData)
		} catch (err) {
			next(err)
		}
	}

	async logout(req: Request, res: Response, next: NextFunction) {
		try {
			const { refreshToken } = req.cookies
			const token = await userService.logout(refreshToken)
			res.clearCookie('refreshToken')
			return res.json(token)
		} catch (err) {
			next(err)
		}
	}

	async activate(req: Request, res: Response, next: NextFunction) {
		try {
			const activationLink = req.params.link
			await userService.activate(activationLink)
			return res.redirect(process.env.CLIENT_URL!)
		} catch (e) {
			next(e)
		}
	}
	async refresh(req: Request, res: Response, next: NextFunction) {
		try {
			const { refreshToken } = req.cookies
			const userData = await userService.refresh(refreshToken)
			res.cookie('refreshToken', userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			})
			return res.json(userData)
		} catch (e) {
			next(e)
		}
	}

	async getUsers(req: Request, res: Response, next: NextFunction) {
		try {
			const users = await userService.getAllUsers()
			return res.json(users)
		} catch (err) {
			next(err)
		}
	}
}

export default new UserController()
