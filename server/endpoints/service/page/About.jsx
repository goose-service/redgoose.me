import { isDev, onRequest, onResponse, printMessage } from '../../../libs/server.js'
import { html } from '../../../classes/Meta.js'
import { setResponse, checkingBot, renderIndex, contentToDescription, getCanonicalUrl, getErrorStatus } from '../_libs.js'
import Layout from '../components/Layout.jsx'
import ErrorScreen from '../components/ErrorScreen.jsx'

const dev = isDev()

async function PageAbout(req, _ctx)
{
  let response

  // trigger request event
  onRequest(req, _ctx)

  try
  {
    if (checkingBot(req))
    {
      const file = Bun.file('./server/resource/about.json')
      const about = await file.json()
      const canonicalUrl = getCanonicalUrl(req)
      const title = `${about.title} 🪴 ${html.title}`
      const description = contentToDescription(about.description)
      response = setResponse((
        <Layout
          title={title}
          _meta={{
            description,
            'og:title': title,
            'og:description': description,
            'og:url': canonicalUrl,
          }}
          _link={{ canonical: canonicalUrl }}>
          <article class="page">
            <header class="page-header">
              <p>Introduce</p>
              <h1>{about.title}</h1>
              <figure>
                <img src={about.coverImage.src[1]} alt={about.coverImage.alt}/>
              </figure>
              <p>{about.description}</p>
            </header>
            {about.information.map((content) => (
              <section>
                <h2>{content.title}</h2>
                <dl>
                  {content.items.map(item => (
                    <>
                      <dt>{item.label}</dt>
                      <dd>{item.body}</dd>
                    </>
                  ))}
                </dl>
              </section>
            ))}
          </article>
        </Layout>
      ))
    }
    else
    {
      response = await renderIndex(req)
    }
  }
  catch (_e)
  {
    if (dev) printMessage('error', `[${_e.status || 500}] ${_e.message}`)
    response = setResponse((
      <ErrorScreen message="Failed get data."/>
    ), getErrorStatus(_e.status))
  }

  // trigger response event
  onResponse(req, response, _ctx)

  return response
}

export default PageAbout
