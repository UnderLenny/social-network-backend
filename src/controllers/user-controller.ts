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
			const { email, password } = req.body
			const userData = await userService.registration(email, password)

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
		} catch (err) {
			next(err)
		}
	}

	async activate(req: Request, res: Response, next: NextFunction) {
		try {
			const activationLink = req.params.link
			await userService.activate(activationLink)
			return res.redirect(process.env.CLIENT_URL || 'https://ya.ru/')
		} catch (err) {
			next(err)
		}
	}

	async refresh(req: Request, res: Response, next: NextFunction) {
		try {
		} catch (err) {
			next(err)
		}
	}

	async getUsers(req: Request, res: Response, next: NextFunction) {
		try {
			res.json(['123', '432'])
		} catch (err) {
			next(err)
		}
	}
}

export default new UserController()
