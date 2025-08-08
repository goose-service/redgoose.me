import home from './home.js'
import nest from './nest.js'
import articles from './articles.js'
import article from './article.js'
import updateStar from './update-star.js'

export default {
  '/api/': home, // 첫화면
  '/api/nest/:code/': nest, // 둥지
  '/api/article/': articles, // 둥지 only 아티클
  '/api/article/:srl/': article, // 아티클 상세
  '/api/article/:srl/star/': { POST: updateStar }, // 좋아요 업데이트
}
