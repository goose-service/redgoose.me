import apiHome from './home.js'
import apiNest from './nest.js'
import apiArticles from './articles.js'
import apiArticle from './article.js'
import apiUpdateStar from './update-star.js'
import apiRss from './rss.js'

export default {
  '/api/': apiHome, // 첫화면
  '/api/nest/:code/': apiNest, // 둥지
  '/api/nest/:code/:category_srl/': apiNest, // 둥지 + 카테고리
  '/api/article/': apiArticles, // 둥지 only 아티클
  '/api/article/:srl/': apiArticle, // 아티클 상세
  '/api/article/:srl/star/': { POST: apiUpdateStar }, // 좋아요 업데이트
  '/rss/': apiRss, // RSS
}
