
import { GetVideoCommentsService } from '../video/GetVideoCommentsService'

import { getVideoData } from './utils/getVideoData'
import { getWordsFromComments } from './utils/getWordsFromComments'
import { getWordsDetails } from './utils/getWordsDetails'
import { getUsersMood } from './utils/getUsersMood'

interface Request {
  videoId: string
}

class CreateRecommendedAnalysisService {
  public async execute ({ videoId } : Request): Promise<any> {
    const getVideoComments = new GetVideoCommentsService()

    const videoData = await getVideoData(videoId)
    const videoComments = await getVideoComments.execute({ videoId })

    const { words } = getWordsFromComments(videoComments)

    const wordsDetails = getWordsDetails(words, 'pt-br')

    const mostCommentedWords = wordsDetails.slice(0, 10)

    const { mood } = getUsersMood(words)

    return { videoData, mostCommentedWords, usersMood: mood }
  }
}

export { CreateRecommendedAnalysisService }
