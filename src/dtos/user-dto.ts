export class UserDto {
	email: string
	id: any
	isActivated: boolean

	constructor(model: IUserModel) {
		this.email = model.email
		this.id = model._id.toString()
		this.isActivated = model.isActivated
	}
}

interface IUserModel {
	email: string
	_id: any
	isActivated: boolean
}
