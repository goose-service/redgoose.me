const Category = ({ items, basePath }) => {
  return (
    <nav class="category" aria-label="분류 목록">
      <h2>분류 목록</h2>
      <ul>
        {items.map((o) => (
          <li>
            <a href={o.srl ? `${basePath}/${o.srl}/` : `${basePath}/`}>
              {o.name}({o.count || 0})
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Category
