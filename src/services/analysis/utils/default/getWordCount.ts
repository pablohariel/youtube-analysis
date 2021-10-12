import { Word } from '../../../../interfaces/word'

interface Request {
  words: Word[]
}

interface Response {
  wordCount: number
}

const getWordCount = ({ words }: Request): Response => {
  const wordCount = words.length

  return { wordCount }
}

export { getWordCount }
