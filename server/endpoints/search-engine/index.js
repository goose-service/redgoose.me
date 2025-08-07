export default {
  '/': new Response('Search Engine: /', { status: 200}),
}

// TODO: 이전버전 참고
// router.get('/', pageHome)
// router.get('/nest/:nestId/', pageNests)
// router.get('/nest/:nestId/:categorySrl/', pageNests)
// router.get('/article/:srl/', pageArticle)
// router.get('/page/about/', pageAbout)
// router.get('/*', pageNotFound)

// TODO: 모든 경로를 통해서 isbot 함수로 검사할지 고민 필요하다.
// TODO: (개발 or 봇)이라면 서치엔진 라우터로 출력
// TODO: (프로덕션 && 봇)이라면 서치엔진 라우터로 출력
// TODO: (프로덕션 && !봇)이라면 dist 서빙
