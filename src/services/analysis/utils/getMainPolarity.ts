import { WordDetails } from '../types'

interface Request {
  words: WordDetails[]
}

interface Response {
  polarity: 'positive' | 'negative' | 'neutral'
}

const getMainPolarity = ({ words }: Request): Response => {
  let positive = 0
  let negative = 0
  let neutral = 0

  for (const item of words) {
    switch (item.polarity) {
      case 'positive':
        positive++
        break
      case 'negative':
        negative++
        break
      case 'neutral':
        neutral++
        break
      default:
        break
    }
  }

  if (positive >= negative && positive >= neutral) {
    return { polarity: 'positive' }
  }

  if (negative >= positive && negative >= neutral) {
    return { polarity: 'negative' }
  }

  return { polarity: 'neutral' }
}

export { getMainPolarity }
