class UserDto {
	email: string
	id: string
	isActivated: boolean

	constructor(model: { email: string; _id: any; isActivated: boolean }) {
		this.email = model.email
		this.id = model._id
		this.isActivated = model.isActivated
	}
}

export default UserDto
