import { GetVideoDataService } from '../../../video/GetVideoDataService'
import { VideoData } from '../../../../interfaces/videoData'

interface Response {
  videoData: VideoData
}

const getVideoData = async (videoId: string): Promise<Response> => {
  const getVideoData = new GetVideoDataService()
  const { videoData } = await getVideoData.execute({ videoId })

  return { videoData }
}

export { getVideoData }
