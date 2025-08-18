import { createPaginate } from '../_libs.js'
import { apiAssets } from '../../../libs/api.js'

const Paginate = ({ total, page, size }) => {
  const items = createPaginate(total, page, apiAssets.size, 10)
  return (
    <nav>
      <h1>페이지 네비게이션</h1>
      <ul>
        {items.map((o) => (
          <li>
            {o.active ? (
              <strong>{o.key} 페이지</strong>
            ) : (
              <a href={o.url}>{o.key} 페이지로 이동</a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Paginate
