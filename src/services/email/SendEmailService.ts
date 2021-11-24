import { createTransport } from 'nodemailer'
import { AppError } from '../../errors/AppError'

interface Request {
  name: string
  email: string
  message: string
}

class SendEmailService {
  public async execute ({ message, email }: Request): Promise<void> {
    if (!message || !email) {
      throw new AppError('Required field not informed')
    }

    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SEND_EMAIL,
        pass: process.env.SEND_EMAIL_PASSWORD
      }
    })

    const mailOptions = {
      from: process.env.SEND_EMAIL,
      to: process.env.RECEIVE_EMAIL,
      subject: `Message to YouMine from ${email}`,
      text: message
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log('Email sent: ' + info.response)
      }
    })
  }
}

export { SendEmailService }
