import { SentiWord } from './getSentiWordList'

interface Request {
  word: string,
  sentiList: SentiWord[]
}

interface Response {
  sentiWordFound: SentiWord,
}

const getSentiListWord = ({ word, sentiList }: Request): Response => {
  const wordFound = sentiList.filter(sentiWord => sentiWord.term === word)[0]

  return { sentiWordFound: wordFound }
}

export { getSentiListWord }
