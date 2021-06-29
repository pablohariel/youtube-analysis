
import { GetVideoInfoService } from '../video/GetVideoInfoService'
import { GetVideoCommentsService } from '../video/GetVideoCommentsService'

import { getWords, getWordsSum } from './utils/filters'

interface Request {
  recommended: true | false,
  videoId: string
}

class CreateAnalysisService {
  public async execute ({ recommended, videoId } : Request): Promise<any> {
    const getVideoInfo = new GetVideoInfoService()
    const getVideoComments = new GetVideoCommentsService()

    const videoInfo = await getVideoInfo.execute({ videoId })
    const videoComments = await getVideoComments.execute({ videoId })

    if (videoInfo) {
      console.log('vidnfo')
    }

    if (recommended) {
      const commentsWords = getWords(videoComments)

      const wordsSum = getWordsSum(commentsWords)

      return wordsSum
    }

    return {}
  }
}

export { CreateAnalysisService }
