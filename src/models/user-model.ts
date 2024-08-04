import mongoose, { Document, Schema } from 'mongoose'

interface IUser extends Document {
	email: string
	password: string
	name: string
	surname: string
	isActivated: boolean
	activationLink: string
}

const userSchema: Schema = new Schema({
	email: { type: String, unique: true, required: true },
	password: { type: String, required: true },
	name: { type: String, required: true },
	surname: { type: String, required: true },
	isActivated: { type: Boolean, default: false },
	activationLink: { type: String },
})

export const userModel = mongoose.model<IUser>('User', userSchema)
