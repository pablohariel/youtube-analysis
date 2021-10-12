import { CommentAnalyzed } from './analyzeComments'
import { LanguagesCount } from '../../../interfaces/languages'

interface Request {
  commentsAnalyzed: CommentAnalyzed[]
}

interface Response {
  languages: LanguagesCount
}

const getLanguages = ({ commentsAnalyzed }: Request): Response => {
  const languages = {
    pt: {
      count: 0
    },
    en: {
      count: 0
    },
    es: {
      count: 0
    },
    ru: {
      count: 0
    },
    fr: {
      count: 0
    },
    notFound: {
      count: 0
    }
  } as LanguagesCount

  for (const comment of commentsAnalyzed) {
    if (languages[comment.language]) {
      languages[comment.language].count++
    }
    if (comment.language === 'not found') {
      languages.notFound.count++
    }
  }

  return { languages }
}

export { getLanguages }
