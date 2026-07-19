import { createPaginate } from '../_libs.js'
import { apiAssets } from '../../../libs/api.js'

const Paginate = ({ total, page, size }) => {
  const items = createPaginate(total, page, size || apiAssets.size, 10)
  return (
    <nav class="paginate" aria-label="페이지 탐색">
      <h2>페이지</h2>
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
