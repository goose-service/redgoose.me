async function updateStar(req, ctx)
{
  let response
  // TODO: 쿠키 검사 넣어야 한다.
  response = Response.json({
    message: 'API / update star from article',
  })
  return response
}

export default updateStar
