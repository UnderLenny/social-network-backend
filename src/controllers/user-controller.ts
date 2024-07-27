import { Request, Response } from 'express'
import userService from '../services/user-service'

class UserController {
	async registration(req: Request, res: Response) {
		try {
			const { email, password } = req.body
			const userData = await userService.registration(email, password)

			res.cookie('refreshToken', userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			})
			return res.json(userData)
		} catch (err) {
			console.log(err)
		}
	}

	async login(req: Request, res: Response) {
		try {
		} catch (err) {}
	}

	async logout(req: Request, res: Response) {
		try {
		} catch (err) {}
	}

	async activate(req: Request, res: Response) {
		try {
			const activationLink = req.params.link
			await userService.activate(activationLink)
			return res.redirect(process.env.CLIENT_URL || 'https://ya.ru/')
		} catch (err) {
			console.log(err)
		}
	}

	async refresh(req: Request, res: Response) {
		try {
		} catch (err) {}
	}

	async getUsers(req: Request, res: Response) {
		try {
			res.json(['123', '432'])
		} catch (err) {}
	}
}

export default new UserController()
