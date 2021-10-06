import { JoinedWord } from '../../../../../interfaces/word'

interface Request {
  words: JoinedWord[],
  sortBrothers: boolean
}

interface Response {
  sortedJoinedWords: JoinedWord[]
}

const sortJoinedWords = ({ words: joinedWords, sortBrothers = false }: Request): Response => {
  const sortedJoinedWords = joinedWords.sort((wordL, wordR) => {
    if (wordL.timesUsed > wordR.timesUsed) {
      return -1
    }
    if (wordL.timesUsed < wordR.timesUsed) {
      return 1
    }
    return 0
  })

  if (sortBrothers) {
    for (const word of sortedJoinedWords) {
      word.brothers = word.brothers.sort((wordL, wordR) => {
        if (wordL.timesUsed > wordR.timesUsed) {
          return -1
        }
        if (wordL.timesUsed > wordR.timesUsed) {
          return 1
        }
        return 0
      })
    }
  }

  return { sortedJoinedWords }
}

export { sortJoinedWords }
