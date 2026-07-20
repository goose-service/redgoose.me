import Layout from './Layout.jsx'

const ErrorScreen = ({ code, message }) => {
  let title
  let displayMessage = message
  switch (code)
  {
    case 204:
      title = '데이터 오류'
      break
    case 503:
      title = '서비스 일시 중단'
      displayMessage = '현재 서비스가 일시적으로 이용할 수 없습니다. 잠시 후 다시 시도해 주세요.'
      break
    default:
      title = '서비스 오류'
      displayMessage = '서비스를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.'
      break
  }
  return (
    <Layout _meta={{ robots: 'noindex, nofollow' }}>
      <article class="error">
        <h1>{title}</h1>
        <p>{displayMessage}</p>
      </article>
    </Layout>
  )
}

export default ErrorScreen
