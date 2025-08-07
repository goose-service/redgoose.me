async function articles(req, ctx)
{
  let response
  response = Response.json({
    message: 'API / articles index',
  })
  return response
}

export default articles
