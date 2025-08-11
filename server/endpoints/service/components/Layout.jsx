import { html } from '../../../classes/Meta.js'

const Layout = ({ children }) => {
  const { title, meta, link } = html
  return (
    <html lang="ko">
      <head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width"/>
        <meta name="author" content={meta['author']}/>
        <meta name="description" content={meta['description']}/>
        <meta name="keywords" content={meta['keywords']}/>
        <link rel="canonical" href={link['canonical']}/>
        <meta property="og:site_name" content={meta['og:site_name']}/>
        <meta property="og:url" content={meta['og:url']}/>
        <meta property="og:locale" content={meta['og:locale']}/>
        <meta property="og:type" content={meta['og:type']}/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="mobile-web-app-capable" content="yes"/>
        <meta name="theme-color" content="currentColor"/>
        <meta property="og:title" content={meta['og:title']}/>
        <meta property="og:description" content={meta['og:description']}/>
        <meta property="og:image" content={meta['og:image']}/>
        <link rel="shortcut icon" href={link['shortcut icon']}/>
        <link rel="icon" type="image/x-icon" href={link['icon']}/>
        <link rel="apple-touch-icon" href={link['apple-touch-icon']}/>
        <link rel="apple-touch-startup-image" href={link['apple-touch-startup-image']}/>
        <link rel="manifest" href={link['manifest']}/>
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}

export default Layout
