const { API_CLIENT_URL } = Bun.env

export function filteringArticle(src)
{
  if (!src) return null
  return {
    srl: src.srl,
    title: src.title,
    date: src.regdate,
    image: src.json?.thumbnail ? `${API_CLIENT_URL}/file/${src.json?.thumbnail}/` : null,
    nest: src.nest?.name || null,
    category: src.category?.name || null,
  }
}
