import { stopWords } from './wordList'

interface Request {
  comment: String
  videoId: String
  filters: {
    avoidAccentuation: boolean
    caseSensitive: boolean
  }
}

interface Response {
  words: string[]
}

const getCommentWords = ({ comment, videoId, filters }: Request): Response => {
  const { avoidAccentuation, caseSensitive } = filters
  const words = comment.match(/[A-Za-záàâãéèêíïóôõöúçqQñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ0-9-]+/g)?.map(word => {
    if (caseSensitive) {
      return avoidAccentuation ? word.normalize('NFD').replace(/[^A-Za-z0-9-]/g, '') : word
    } else {
      return avoidAccentuation ? word.toLowerCase().normalize('NFD').replace(/[^a-z0-9-]/g, '') : word.toLowerCase()
    }
  })
  const filteredWords = [] as string[]

  if (words) {
    for (const word of words) {
      if (!stopWords.includes(word) && !word.includes(videoId.toLocaleLowerCase())) {
        if (word.length > 1) {
          filteredWords.push(word)
        }
      }
    }
    const finalFilteredWords = filteredWords.join(' ').match(/[A-Za-záàâãéèêíïóôõöúçqQñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ-]+/g)?.filter(word => word.length > 1)

    if (finalFilteredWords) {
      return { words: finalFilteredWords }
    }
  }

  return { words: [] }
}

export { getCommentWords }
