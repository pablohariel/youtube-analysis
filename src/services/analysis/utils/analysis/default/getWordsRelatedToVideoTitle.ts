import { Comment, Reply } from '../../../../../interfaces/comment'
import { JoinedWord } from '../../../../../interfaces/word'

interface Request {
  videoTitle: string,
  words: JoinedWord[]
}

export interface WordRelatedToVideoTitle {
  timesUsed: number,
  word: string,
  comments: (Comment | Reply)[]
}

interface Response {
  wordsRelatedToVideoTitle: WordRelatedToVideoTitle[]
}

const getWordsRelatedToVideoTitle = ({ videoTitle, words }: Request): Response => {
  const wordsRelatedToVideoTitle = [] as WordRelatedToVideoTitle[]

  for (const word of words) {
    if (videoTitle.includes(word.content)) {
      wordsRelatedToVideoTitle.push({
        timesUsed: word.timesUsed,
        word: word.content,
        comments: word.comments
      })
    }
  }

  return { wordsRelatedToVideoTitle }
}

export { getWordsRelatedToVideoTitle }
