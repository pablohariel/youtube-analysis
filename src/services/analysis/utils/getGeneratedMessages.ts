import { WordDetails } from '../types'

interface Request {
  words: WordDetails[],
  mood: string
}

const getGeneratedMessages = ({ words, mood }: Request): string[] => {
  const mostCommentedWord = words.slice(0, 1)[0]

  return [`People are commenting a lot about ${mostCommentedWord.word} in a ${mood} way`]
}

export { getGeneratedMessages }
