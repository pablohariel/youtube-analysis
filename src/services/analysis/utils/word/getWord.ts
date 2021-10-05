import { JoinedWord } from '../../../../interfaces/word'

interface Request {
  wordToFind: string,
  words: JoinedWord[]
}

interface Response {
  wordFound: JoinedWord | undefined
}

const getWord = ({ wordToFind, words }: Request): Response => {
  const wordFound = words.filter(word => word.content === wordToFind.toLocaleLowerCase())[0]

  if (wordFound) {
    return { wordFound }
  }

  return { wordFound: undefined }
}

export { getWord }
