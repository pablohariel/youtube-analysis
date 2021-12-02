import { LanguagesCount } from '../../../../interfaces/languages'
import { CommentAnalyzed } from '../../../../interfaces/comment'

interface Request {
  comments: CommentAnalyzed[]
  filters: {
    includeCommentReplies: boolean
  }
}

interface Response {
  languages: LanguagesCount
}

const getLanguages = ({ comments, filters }: Request): Response => {
  const { includeCommentReplies } = filters

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

  if (includeCommentReplies) {
    for (const comment of comments) {
      if (languages[comment.language]) {
        languages[comment.language].count++
      }
      if (comment.language === 'not found') {
        languages.notFound.count++
      }
    }

    return { languages }
  } else {
    for (const comment of comments) {
      if (comment.type === 'comment') {
        if (languages[comment.language]) {
          languages[comment.language].count++
        }
        if (comment.language === 'not found') {
          languages.notFound.count++
        }
      }
    }

    return { languages }
  }
}

export { getLanguages }
