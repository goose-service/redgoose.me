import Layout from './Layout.jsx'

const ErrorScreen = ({ message }) => {
  return (
    <Layout>
      <article>
        <h1>Service Error</h1>
        <p>{message}</p>
      </article>
    </Layout>
  )
}

export default ErrorScreen
