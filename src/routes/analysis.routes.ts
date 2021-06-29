import { Router } from 'express'

// import { GetVideoInfoService } from '../services/video/GetVideoInfoService'
import { CreateAnalysisService } from '../services/analysis/CreateAnalysisService'

const analysisRouter = Router()

analysisRouter.get('/', async (request, response) => {
  const { recommended = 'true' } = request.query
  const createAnalysis = new CreateAnalysisService()

  if (recommended === 'true') {
    const analysis = await createAnalysis.execute({ recommended: true, videoId: '-ZJME_FtYJU' })
    return response.json(analysis)
  }

  // const getVideoInfo = new GetVideoInfoService()

  // const { id, snippet, statistics, contentDetails } = await getVideoInfo.execute({ videoId: '10P0swEVhQ0' })

  return response.json({ message: false })
})

export { analysisRouter }
