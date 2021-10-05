import { JoinedWord } from '../../../../interfaces/word'

interface Request {
  wordsToFind: string[],
  words: JoinedWord[]
}

interface Response {
  words: JoinedWord[]
}

const getWord = ({ wordsToFind, words }: Request): Response => {
  const wordsFound = [] as JoinedWord[]

  for (const wordToFind of wordsToFind) {
    const wordFound = words.filter(word => word.content === wordToFind.toLocaleLowerCase())[0]
    if (wordFound) {
      wordsFound.push(wordFound)
    }
  }

  return { words: wordsFound }
}

export { getWord }
