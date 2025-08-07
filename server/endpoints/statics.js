function statics()
{
  // TODO: `/*` 경로를 dist 폴더로 서빙한다.
  return new Response('Static: /', { status: 200})
}

export default {
  '/*': statics,
}
