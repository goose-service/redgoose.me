const IndexItem = ({ srl, title, date, image, nest, category }) => {
  return (
    <>
      {image && (
        <figure>
          <img src={image} alt={title} loading="lazy"/>
        </figure>
      )}
      <h3><a href={`/article/${srl}/`}>{title}</a></h3>
      <dl>
        {nest && (
          <>
            <dt>둥지</dt>
            <dd>{nest}</dd>
          </>
        )}
        {category && (
          <>
            <dt>분류</dt>
            <dd>{category}</dd>
          </>
        )}
        {date && (
          <>
            <dt>등록일</dt>
            <dd>{date}</dd>
          </>
        )}
      </dl>
    </>
  )
}

export default IndexItem
