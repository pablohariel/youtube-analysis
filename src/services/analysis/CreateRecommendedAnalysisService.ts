
import { GetVideoCommentsService } from '../video/GetVideoCommentsService'

import { getVideoData } from './utils/getVideoData'
import { getWordsFromComments } from './utils/getWordsFromComments'
import { getWordsSum } from './utils/getWordsSum'
import { getUsersMood } from './utils/getUsersMood'

interface Request {
  videoId: string
}

class CreateRecommendedAnalysisService {
  public async execute ({ videoId } : Request): Promise<any> {
    const getVideoComments = new GetVideoCommentsService()

    const videoData = await getVideoData(videoId)
    const videoComments = await getVideoComments.execute({ videoId })

    const { words, wordsAndBrothers } = getWordsFromComments(videoComments)

    const wordsSum = getWordsSum(words)

    const mostCommentedWords = wordsSum.slice(0, 10)

    const { mood } = getUsersMood(words)

    if (wordsAndBrothers) console.log('')

    return { videoData, mostCommentedWords, usersMood: mood }
  }
}

export { CreateRecommendedAnalysisService }
