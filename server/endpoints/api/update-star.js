async function updateStar(req, ctx)
{
  let response
  response = Response.json({
    message: 'API / update star from article',
  })
  return response
}

export default updateStar
