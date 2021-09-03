import { prisma } from '../../database/connection'
import { AppError } from '../../errors/AppError'

interface Request {
  id: string
}

interface Response {
  id: string,
  isAdmin: boolean,
  email: string,
  name: string | null,
  created_at: Date,
  updated_at: Date
}

class GetUserService {
  public async execute ({ id }: Request): Promise<Response> {
    const user = await prisma.user.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        isAdmin: true,
        email: true,
        name: true,
        created_at: true,
        updated_at: true
      }
    })

    if (!user) {
      throw new AppError('User not found')
    }

    return user
  }
}

export { GetUserService }
