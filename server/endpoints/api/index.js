import home from './home.js'
import nest from './nest.js'
import articles from './articles.js'
import article from './article.js'
import updateStar from './update-star.js'

export default {
  '/api/': home,
  '/api/nest/:code/': nest,
  '/api/nest/:code/:category_srl/': nest,
  '/api/article/': articles,
  '/api/article/:srl/': article,
  '/api/article/:srl/star/': { POST: updateStar },
}
