import { JoinedWord } from '../../../../interfaces/word'

interface Request {
  words: JoinedWord[]
}

interface Response {
  wordsMostUsed: JoinedWord[]
}

const getWordsMostUsed = ({ words }: Request): Response => {
  const sortedWords = words.sort((wordL, wordR) => {
    if (wordL.timesUsed > wordR.timesUsed) {
      return -1
    }
    if (wordL.timesUsed < wordR.timesUsed) {
      return 1
    }
    return 0
  })

  const wordsMostUsed = sortedWords.slice(0, 10)

  return { wordsMostUsed }
}

export { getWordsMostUsed }
