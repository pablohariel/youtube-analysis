interface SimpleJoinedWord {
  content: string,
  timesUsed: string,
  languages: string,
  polarity: string,
  class: string,
}

interface JoinedWord {
  content: string,
  timesUsed: string,
  languages: string,
  polarity: string,
  class: string,
  brothers: SimpleJoinedWord[]
}

interface SimpleWord {
  content: string,
  languages: string,
  polarity: string,
  class: string,
}

interface Word {
  content: string,
  languages: string,
  polarity: string,
  class: string,
  brothers: SimpleWord[]
}

export { SimpleJoinedWord, JoinedWord, Word, SimpleWord }
