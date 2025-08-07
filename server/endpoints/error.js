export default function error(err)
{
  // TODO
  return new Response(`Internal Error: ${err.message}`, {
    status: 500,
    headers: { 'Content-Type': 'text/plain' },
  })
}
