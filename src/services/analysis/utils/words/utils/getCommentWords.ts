import { stopWords } from './wordList'

interface Request {
  comment: String,
  videoId: String
}

interface Response {
  words: string[]
}

const getCommentWords = ({ comment, videoId }: Request): Response => {
  const words = comment.match(/[A-Za-záàâãéèêíïóôõöúçqQñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ0-9-]+/g)?.map(word => word.toLocaleLowerCase())
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
