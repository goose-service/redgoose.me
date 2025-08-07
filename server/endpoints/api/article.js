async function article(req, ctx)
{
  let response
  response = Response.json({
    message: 'API / article item',
  })
  return response
}

export default article
