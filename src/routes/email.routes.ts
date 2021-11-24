import { Router } from 'express'

import { SendEmailService } from '../services/email/SendEmailService'

const emailRouter = Router()

emailRouter.post('/', async (request, response) => {
  const { name, email, message } = request.body

  const sendEmail = new SendEmailService()
  await sendEmail.execute({ name, email, message })

  return response.send()
})

export { emailRouter }
