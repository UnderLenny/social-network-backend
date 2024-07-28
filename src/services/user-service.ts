import bcrypt from 'bcryptjs'
import { JwtPayload } from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import UserDto from '../dtos/user-dto'
import { ApiError } from '../exceptions/api-error'
import { userModel } from '../models/user-model'
import mailService from './mail-service'
import tokenService from './token-service'

interface MyJwtPayload extends JwtPayload {
	id: string
}

class UserService {
	async registration(email: string, password: string) {
		const candidate = await userModel.findOne({ email })
		if (candidate) {
			throw ApiError.BadRequest(
				`Пользователь с таким почтовым адресом ${email} уже существует`
			)
		}

		const hashPassword = await bcrypt.hash(password, 3)
		const activationLink = uuidv4()

		const user = await userModel.create({
			email,
			password: hashPassword,
			activationLink,
		})
		await mailService.sendActivationMail(
			email,
			`${process.env.API_URL}/api/v1/activate/${activationLink}`
		)

		const userDto = new UserDto(user)
		const tokens = tokenService.generateTokens({ ...userDto })
		await tokenService.saveToken(userDto.id, tokens.refreshToken)

		return {
			...tokens,
			user: userDto,
		}
	}

	async activate(activationLink: string) {
		const user = await userModel.findOne({ activationLink })
		if (!user) {
			throw ApiError.BadRequest('Некорректная ссылка для активации')
		}

		user.isActivated = true
		await user.save()
	}

	async login(email: string, password: string) {
		const user = await userModel.findOne({ email })
		if (!user) {
			throw ApiError.BadRequest('Пользователь с таким email не был найден')
		}

		const isPassEquals = await bcrypt.compare(password, user.password)
		if (!isPassEquals) {
			throw ApiError.BadRequest('Неверный пароль')
		}

		const userDto = new UserDto(user)
		const tokens = tokenService.generateTokens({ ...userDto })

		await tokenService.saveToken(userDto.id, tokens.refreshToken)

		return {
			...tokens,
			user: userDto,
		}
	}

	async logout(refreshToken: string) {
		const token = await tokenService.removeToken(refreshToken)
		return token
	}

	async refresh(refreshToken: string) {
		if (!refreshToken) {
			throw ApiError.UnauthorizedError()
		}
		const userData = tokenService.validateRefreshToken(
			refreshToken
		) as MyJwtPayload

		const tokenFromDb = await tokenService.findToken(refreshToken)

		if (!userData || !tokenFromDb) {
			throw ApiError.UnauthorizedError()
		}

		const user = await userModel.findById(userData.id)

		if (!user) {
			throw ApiError.UnauthorizedError()
		}

		const userDto = new UserDto(user)
		const tokens = tokenService.generateTokens({ ...userDto })

		await tokenService.saveToken(userDto.id, tokens.refreshToken)

		return {
			...tokens,
			user: userDto,
		}
	}

	async getAllUsers() {
		const users = await userModel.find()
		return users
	}
}

export default new UserService()
