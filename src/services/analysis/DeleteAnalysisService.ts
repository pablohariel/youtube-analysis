import { Analysis } from '@prisma/client'
import { AppError } from '../../errors/AppError'
import { ObjectId } from 'bson'

import { prisma } from '../../database/connection'

interface Request {
  id: string
}

class DeleteAnalysisService {
  public async execute ({ id } : Request): Promise<Analysis> {
    try {
      id = new ObjectId(id).toHexString()
    } catch (error) {
      throw new AppError('Analysis not found')
    }

    const toDeleteAnalysis = await prisma.analysis.findUnique({
      where: {
        id
      }
    })

    if (!toDeleteAnalysis) {
      throw new AppError('Analysis not found')
    }

    const deletedAnalysis = await prisma.analysis.delete({
      where: {
        id
      }
    })

    return deletedAnalysis
  }
}

export { DeleteAnalysisService }
