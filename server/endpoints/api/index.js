import home from './home.js'
import nests from './nests.js'
import articles from './articles.js'
import article from './article.js'
import updateStar from './update-star.js'

export default {
  '/api/': home,
  '/api/nest/:code/': nests,
  '/api/nest/:srl/article/': articles,
  '/api/article/:srl/': article,
  '/api/article/:srl/star/': { POST: updateStar },
}
