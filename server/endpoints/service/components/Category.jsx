const Category = ({ items, basePath }) => {
  return (
    <nav>
      <h1>분류목록</h1>
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
