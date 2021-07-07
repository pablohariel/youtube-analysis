import { GetVideoCommentsService } from '../video/GetVideoCommentsService'
import { getVideoData } from './utils/getVideoData'
import { getWordsFromComments } from './utils/getWordsFromComments'
import { getUsersMood } from './utils/getUsersMood'

interface Request {
  videoId: string,
  getMood: true | false,
}

class CreateAnalysisService {
  public async execute ({ videoId, getMood }: Request) {
    const videoData = await getVideoData(videoId)

    const getVideoComments = new GetVideoCommentsService()

    const videoComments = await getVideoComments.execute({ videoId })
    const { words } = getWordsFromComments(videoComments)

    if (getMood) {
      const { mood } = getUsersMood(words)

      return { videoData, usersMood: mood }
    }

    return { videoData }
  }
}

export { CreateAnalysisService }
