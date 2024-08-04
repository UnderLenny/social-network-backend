class UserDto {
	email: string
	id: string
	name: string
	surname: string
	isActivated: boolean

	constructor(model: {
		email: string
		_id: any
		name: string
		surname: string
		isActivated: boolean
	}) {
		this.email = model.email
		this.id = model._id
		this.name = model.name
		this.surname = model.surname
		this.isActivated = model.isActivated
	}
}

export default UserDto
