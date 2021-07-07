import { GetVideoCommentsService } from '../video/GetVideoCommentsService'
import { getVideoData } from './utils/getVideoData'
import { getWordsSum } from './utils/getWordsSum'
import { getWordsFromComments } from './utils/getWordsFromComments'
import { getUsersMood } from './utils/getUsersMood'

interface Request {
  videoId: string,
  requestedWords: string[],
  getMood: true | false,
  getMostCommentedWords: true | false
}

class CreateCompleteAnalysisService {
  public async execute ({ videoId, requestedWords, getMood, getMostCommentedWords } : Request) {
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

      if (getMood) {
        const { mood } = getUsersMood(words)

        return { videoData, mostCommentedWords, requestedWords: requestedWordsSum, usersMood: mood }
      }

      return { videoData, mostCommentedWords, requestedWords: requestedWordsSum }
    }

    if (getMood) {
      const { mood } = getUsersMood(words)

      return { videoData, requestedWords: requestedWordsSum, usersMood: mood }
    }

    return { videoData, requestedWords: requestedWordsSum }
  }
}

export { CreateCompleteAnalysisService }
