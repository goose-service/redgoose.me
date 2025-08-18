import Layout from './Layout.jsx'

const ErrorScreen = ({ code, message }) => {
  let title
  switch (code)
  {
    case 204:
      title = '데이터 오류'
      break
    default:
      title = '서비스 오류'
      break
  }
  return (
    <Layout>
      <article>
        <h1>{title}</h1>
        <p>{message}</p>
      </article>
    </Layout>
  )
}

export default ErrorScreen
