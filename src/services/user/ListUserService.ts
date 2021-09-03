import { prisma } from '../../database/connection'

interface Response {
  id: string,
  isAdmin: boolean,
  email: string,
  name: string | null,
  created_at: Date,
  updated_at: Date
}

class ListUserService {
  public async execute (): Promise<Response[]> {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        isAdmin: true,
        email: true,
        name: true,
        created_at: true,
        updated_at: true
      }
    })

    return users
  }
}

export { ListUserService }
