import { WordFilters } from '../../../../../interfaces/requestData'
import { JoinedWord } from '../../../../../interfaces/word'

interface Request {
  wordsToFind: string[],
  words: JoinedWord[],
  filters: WordFilters
}

interface Response {
  dataFound: JoinedWord[]
}

const getWords = ({ wordsToFind, words }: Request): Response => {
  const dataFound = [] as JoinedWord[]

  for (const wordToFind of wordsToFind) {
    const wordFound = words.filter(word => word.content === wordToFind.toLocaleLowerCase())[0]
    if (wordFound) {
      dataFound.push(wordFound)
    }
  }

  return { dataFound }
}

export { getWords }
