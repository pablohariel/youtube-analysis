import { JoinedWord } from '../../../../interfaces/word'

interface Request {
  words: JoinedWord[]
}

interface Response {
  mostUsedWords: JoinedWord[]
}

const getMostUsedWords = ({ words }: Request): Response => {
  const sortedWords = words.sort((wordL, wordR) => {
    if (wordL.timesUsed > wordR.timesUsed) {
      return -1
    }
    if (wordL.timesUsed < wordR.timesUsed) {
      return 1
    }
    return 0
  })

  const mostUsedWords = sortedWords.slice(0, 10)

  return { mostUsedWords }
}

export { getMostUsedWords }
