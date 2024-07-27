import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

class MailService {
	private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>

	constructor() {
		this.transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: parseInt(process.env.SMTP_PORT || '465'),
			secure: true,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASSWORD,
			},
		} as SMTPTransport.Options)
	}

	async sendActivationMail(to: string, link: string) {
		await this.transporter.sendMail({
			from: process.env.SMTP_USER,
			to,
			subject: 'Активация пользователя на Social Network',
			text: '',
			html: `
				<div>
					<h1>Для активации аккаунта перейдите по ссылке</h1>
					<a href="${link}">${link}</a>
				</div>
			`,
		})
	}
}

export default new MailService()
