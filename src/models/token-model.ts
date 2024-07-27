import mongoose, { Document, Schema } from 'mongoose'

interface IToken extends Document {
	user: mongoose.Types.ObjectId
	refreshToken: string
}

const tokenSchema: Schema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'User' },
	refreshToken: { type: String, required: true },
})

export const tokenModel = mongoose.model<IToken>('Token', tokenSchema)
