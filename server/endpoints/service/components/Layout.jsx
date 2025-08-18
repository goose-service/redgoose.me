import { html } from '../../../classes/Meta.js'

const css = `
html, body { -webkit-text-size-adjust: 100%; }
body { margin: 24px; word-wrap: break-word; word-break: keep-all; }
figure { margin: 0; }
img { display: block; max-width: 100%; }
ul { padding-left: 24px; }
blockquote { margin: 1rem; }
pre { word-break: break-all; white-space: pre-wrap; }
`

const Layout = ({ children, title, _meta, _link }) => {
  const navigation = require('../../../resource/navigation.json')
  let { meta, link } = html
  const _css = css.replace(/\n/g, '').trim()
  if (_meta) meta = { ...meta, ..._meta }
  if (_link) link = { ...link, ..._link }
  return (
    <html lang="ko">
      <head>
        <title>{title || html.title}</title>
        <meta name="viewport" content="width=device-width"/>
        <meta name="author" content={meta['author']}/>
        <meta name="description" content={meta['description']}/>
        <meta name="keywords" content={meta['keywords']}/>
        <link rel="canonical" href={link['canonical']}/>
        <meta property="og:title" content={meta['og:title']}/>
        <meta property="og:description" content={meta['og:description']}/>
        <meta property="og:image" content={meta['og:image']}/>
        <meta property="og:site_name" content={meta['og:site_name']}/>
        <meta property="og:url" content={meta['og:url']}/>
        <meta property="og:locale" content={meta['og:locale']}/>
        <meta property="og:type" content={meta['og:type']}/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="mobile-web-app-capable" content="yes"/>
        <meta name="theme-color" content="currentColor"/>
        <link rel="shortcut icon" href={link['shortcut icon']}/>
        <link rel="icon" type="image/x-icon" href={link['icon']}/>
        <link rel="apple-touch-icon" href={link['apple-touch-icon']}/>
        <link rel="apple-touch-startup-image" href={link['apple-touch-startup-image']}/>
        <link rel="manifest" href={link['manifest']}/>
        <style>{_css}</style>
      </head>
      <body>
        <main>
          <header>
            <h1><a href="/">{html.title}</a></h1>
            {navigation.global?.length > 0 && (
              <nav>
                <ul>
                  {navigation.global.map((dep1) => (
                    <li>
                      <a href={dep1.href}>{dep1.label}</a>
                      {dep1.children?.length > 0 && (
                        <ul>
                          {dep1.children.map((dep2) => (
                            <li>
                              <a href={dep2.href}>{dep2.label}</a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </header>
          {children}
          <footer>
            Copyright &copy; 2013-#{new Date().getFullYear()} redgoose. All right reserved.
          </footer>
        </main>
      </body>
    </html>
  )
}

export default Layout
