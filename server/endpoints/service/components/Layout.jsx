import { html } from '../../../classes/Meta.js'
import css from '../style.css' with { type: 'text' }

const Layout = ({ children, title, _meta, _link }) => {
  const navigation = require('../../../resource/navigation.json')
  const meta = { ...html.meta, ..._meta }
  const link = { ...html.link, ..._link }
  return (
    <html lang="ko">
      <head>
        <meta charset="utf-8"/>
        <title>{title || html.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="author" content={meta['author']}/>
        <meta name="description" content={meta['description']}/>
        <meta name="keywords" content={meta['keywords']}/>
        {meta['robots'] && <meta name="robots" content={meta['robots']}/>}
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
        <meta name="theme-color" content="#f4f5f3"/>
        <link rel="shortcut icon" href={link['shortcut icon']}/>
        <link rel="icon" type="image/x-icon" href={link['icon']}/>
        <link rel="apple-touch-icon" href={link['apple-touch-icon']}/>
        <link rel="apple-touch-startup-image" href={link['apple-touch-startup-image']}/>
        <link rel="manifest" href={link['manifest']}/>
        <style>{css}</style>
      </head>
      <body>
        <main class="site">
          <header class="site-header">
            <p class="site-title"><a href="/">{html.title}</a></p>
            {navigation.global?.length > 0 && (
              <nav class="site-nav" aria-label="주요 메뉴">
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
          <footer class="site-footer">
            Copyright &copy; 2013&ndash;{new Date().getFullYear()} GoOSe. All rights reserved.
          </footer>
        </main>
      </body>
    </html>
  )
}

export default Layout
