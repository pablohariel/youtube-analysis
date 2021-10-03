interface Word {
  word: string,
  brothers: string[]
}

interface Words {
  words: Word[]
}

interface Brother {
  word: String,
  timesUsed: Number,
  polarity: 'positive' | 'negative' | 'neutral',
  class: 'adjective' | 'noun' | 'verb' | 'undefined'
}

interface WordDetails {
  word: String,
  timesUsed: Number,
  polarity: 'positive' | 'negative' | 'neutral',
  class: 'adjective' | 'noun' | 'verb' | 'undefined',
  brothers: Brother[]
}

export { Word, Words, WordDetails, Brother }
