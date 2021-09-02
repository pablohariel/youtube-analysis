import { PrismaClient } from '@prisma/client'
import { AppError } from '../../errors/AppError'
import { ObjectId } from 'bson'

interface Request {
  id: string
}

class GetAnalysisService {
  public async execute ({ id } : Request): Promise<any> {
    const prisma = new PrismaClient()

    try {
      id = new ObjectId(id).toHexString()
    } catch (error) {
      throw new AppError('Analysis not found')
    }

    const analysis = await prisma.analysis.findUnique({
      where: {
        id
      }
    })

    if (!analysis) {
      throw new AppError('Analysis not found')
    }

    return analysis
  }
}

export { GetAnalysisService }
