const Empty = ({ title, message }) => {
  return (
    <article>
      <h1>{title || '데이터 없음'}</h1>
      <p>{message || '데이터가 없습니다. 확인해주세요.'}</p>
    </article>
  )
}

export default Empty
