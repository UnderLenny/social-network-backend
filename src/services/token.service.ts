import jwt from 'jsonwebtoken'
import { tokenModel } from '../models/token-model'

export interface ITokenPayload {
	email: string
	id: string
	isActivated: boolean
}

class TokenService {
	generateTokens(payload: ITokenPayload) {
		const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
			expiresIn: process.env.EXPIRES_IN_ACCESS,
		})
		const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
			expiresIn: process.env.EXPIRES_IN_REFRESH,
		})

		return {
			accessToken,
			refreshToken,
		}
	}

	validateAccessToken(token: string) {
		try {
			const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET!)
			return userData
		} catch (err) {
			return null
		}
	}

	validateRefreshToken(token: string) {
		try {
			const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET!)
			return userData
		} catch (err) {
			return null
		}
	}

	async saveToken(userId: string, refreshToken: string) {
		const tokenData = await tokenModel.findOne({ user: userId })
		if (tokenData) {
			tokenData.refreshToken = refreshToken
			return tokenData.save()
		}

		const token = await tokenModel.create({ user: userId, refreshToken })
		return token
	}

	async removeToken(refreshToken: string) {
		const tokenData = await tokenModel.deleteOne({ refreshToken })
		return tokenData
	}

	async findToken(refreshToken: string) {
		const tokenData = await tokenModel.findOne({ refreshToken })
		return tokenData
	}
}

export default new TokenService()
