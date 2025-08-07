
/**
 * home
 *
 * @return {Promise<Response>}
 */
async function home(req, ctx)
{
  let response
  response = Response.json({
    'message': 'API / home',
  })
  return response
}

export default home
