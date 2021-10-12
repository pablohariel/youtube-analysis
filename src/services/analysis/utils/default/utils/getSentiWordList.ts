import path from 'path'

const fs = require('fs')
const readline = require('readline')

export interface SentiWord {
  id: string,
  posScore: number,
  negScore: number,
  term: string
}

interface Response {
  sentiWordList: SentiWord[]
}

const getSentiWordList = async (): Promise<Response> => {
  const fileStream = fs.createReadStream(path.resolve(__dirname, 'sentiWordListPtBr.txt'))

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })

  const words = [] as SentiWord[]

  for await (const line of rl) {
    const splitedLine = line.toString().split('\t')

    words.push({
      id: splitedLine[0],
      posScore: Number(splitedLine[1]),
      negScore: Number(splitedLine[2]),
      term: splitedLine[3]
    })
  }

  return { sentiWordList: words }
}

export { getSentiWordList }
