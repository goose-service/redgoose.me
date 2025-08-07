async function nests(req, ctx)
{
  let response
  response = Response.json({
    message: 'API / nests index',
  })
  return response
}

export default nests
