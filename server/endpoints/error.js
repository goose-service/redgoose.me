export default function error(err)
{
  return new Response('Internal Server Error', {
    status: err.status || 500,
    statusText: err.message,
  })
}
