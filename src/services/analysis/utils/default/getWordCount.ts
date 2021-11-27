import { JoinedWord } from '../../../../interfaces/word'

interface Request {
  words: JoinedWord[]
  filters: {
    countRepeatedWords: boolean
  }
}

interface Response {
  wordCount: number
}

const getWordCount = ({ words, filters }: Request): Response => {
  const { countRepeatedWords } = filters

  if (countRepeatedWords) {
    let wordCount = 0

    for (const word of words) {
      wordCount += word.timesUsed
    }

    return { wordCount }
  }

  const wordCount = words.length

  return { wordCount }
}

export { getWordCount }
