import { GetVideoCommentsService } from '../video/GetVideoCommentsService'
import { getVideoData } from './utils/getVideoData'
import { getWordsSum } from './utils/getWordsSum'
import { getWordsFromComments } from './utils/getWordsFromComments'

interface Request {
  videoId: string,
  requestedWords: string[],
  getMostCommentedWords: true | false
}

class CreateMiningAnalysisService {
  public async execute ({ videoId, requestedWords, getMostCommentedWords }: Request) {
    const videoData = await getVideoData(videoId)

    const getVideoComments = new GetVideoCommentsService()

    const videoComments = await getVideoComments.execute({ videoId })
    const { words } = getWordsFromComments(videoComments)

    const wordsSum = getWordsSum(words)

    const requestedWordsSum = wordsSum.filter(item => {
      if (requestedWords.includes(item.word)) {
        return true
      } else {
        return false
      }
    })

    if (getMostCommentedWords) {
      const mostCommentedWords = wordsSum.slice(0, 10)

      return { videoData, mostCommentedWords, requestedWords: requestedWordsSum }
    }

    return { videoData, requestedWords: requestedWordsSum }
  }
}

export { CreateMiningAnalysisService }
