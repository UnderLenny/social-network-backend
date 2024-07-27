import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { UserDto } from '../dtos/user-dto'
import { userModel } from '../models/user-model'
import mailService from './mail-service'
import tokenService from './token.service'

class UserService {
	async registration(email: string, password: string) {
		const candidate = await userModel.findOne({ email })
		if (candidate) {
			throw new Error(
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
		await mailService.sendActivationMail(email, activationLink)

		const userDto = new UserDto(user)
		const tokens = tokenService.generateTokens({ ...userDto })
		await tokenService.saveToken(userDto.id, tokens.refreshToken)

		return {
			...tokens,
			user: userDto,
		}
	}
}

export default new UserService()
