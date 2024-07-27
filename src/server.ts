require('dotenv').config()
import mongoose from 'mongoose'
import app from './app'

const PORT = process.env.PORT || 5000

const start = async () => {
	try {
		await mongoose.connect(process.env.DB_URL!).then(() => {
			console.log('DB connected')
		})
		app.listen(PORT, () => {
			console.log(`Server started on port: ${PORT}`)
		})
	} catch (err) {
		console.log(err)
	}
}

start()
