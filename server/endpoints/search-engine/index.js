export default {
  '/': new Response('Search Engine: /', { status: 200}),
}

// TODO: 이전버전 참고
// router.get('/', pageHome)
// router.get('/nest/:nestId/', pageNests)
// router.get('/nest/:nestId/:categorySrl/', pageNests)
// router.get('/article/:srl/', pageArticle)
// router.get('/page/about/', pageAbout)

// TODO: 모든 경로를 통해서 isbot 함수로 검사할지 고민 필요하다.
// TODO: 개발모드라면 vite.config 영역에서 구분되어서 백엔드로 출력하지 못할수도 있다.
// TODO: (봇)이라면 서치엔진 라우터로 출력
// TODO: (!봇)이라면 dist 서빙
// TODO: req.headers['user-agent']를 통해서 봇인지 확인하기 때문에 처리 함수 내부에서 검사사하고 봇이 아니라면 index.html으로 서빙한다.
