import { Router } from 'express'

import { GetVideoInfoService } from '../services/video/GetVideoInfoService'

const analysisRouter = Router()

analysisRouter.get('/', async (request, response) => {
  const getVideoInfo = new GetVideoInfoService()

  const { id, snippet, statistics, contentDetails } = await getVideoInfo.execute({ videoId: '10P0swEVhQ0' })

  return response.json({ id, snippet, statistics, contentDetails })
})

export { analysisRouter }
