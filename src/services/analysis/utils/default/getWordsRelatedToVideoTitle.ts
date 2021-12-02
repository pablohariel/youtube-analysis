import { Comment, Reply } from '../../../../interfaces/comment'
import { JoinedWord } from '../../../../interfaces/word'

interface Request {
  videoTitle: string
  words: JoinedWord[]
  filters: {
    avoidAccentuation: boolean
    caseSensitive: boolean
  }
}

export interface WordRelatedToVideoTitle {
  word: string
  timesUsed: number
  comments: (Comment | Reply)[]

}

interface Response {
  wordsRelatedToVideoTitle: WordRelatedToVideoTitle[]
}

const getWordsRelatedToVideoTitle = ({ videoTitle, words, filters }: Request): Response => {
  const { avoidAccentuation, caseSensitive } = filters

  const titleWords = videoTitle.match(/[A-Za-záàâãéèêíïóôõöúçqQñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ0-9-]+/g)?.map(word => {
    if (caseSensitive) {
      return avoidAccentuation ? word.normalize('NFD').replace(/[^A-Za-z0-9-]/g, '') : word
    } else {
      return avoidAccentuation ? word.toLowerCase().normalize('NFD').replace(/[^a-z0-9-]/g, '') : word.toLowerCase()
    }
  })

  const wordsRelatedToVideoTitle = [] as WordRelatedToVideoTitle[]

  if (titleWords) {
    for (const word of words) {
      if (titleWords.includes(word.content)) {
        wordsRelatedToVideoTitle.push({
          timesUsed: word.timesUsed,
          word: word.content,
          comments: word.comments
        })
      }
    }
  }

  return { wordsRelatedToVideoTitle }
}

export { getWordsRelatedToVideoTitle }
