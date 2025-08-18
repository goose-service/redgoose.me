import { JSDOM } from 'jsdom'

async function getHtmlContent()
{
  const htmlFile = Bun.file('dist/index.html')
  const htmlText = await htmlFile.text()
  const { window } = new JSDOM(htmlText)
  return window.document
}

function convertElementToObject($head)
{
  let result = {
    meta: {},
    link: {},
  }
  $head.forEach((el) => {
    const tagName = el.tagName.toLowerCase()
    switch (tagName)
    {
      case 'title':
        result.title = el.textContent
        break
      case 'meta':
        if (el.getAttribute('name'))
        {
          result.meta[el.getAttribute('name')] = el.getAttribute('content')
        }
        else if (el.getAttribute('property'))
        {
          result.meta[el.getAttribute('property')] = el.getAttribute('content')
        }
        break
      case 'link':
        if (el.getAttribute('rel'))
        {
          result.link[el.getAttribute('rel')] = el.getAttribute('href')
        }
        break
    }
  })
  return result
}

async function writeFile(obj)
{
  const raw = JSON.stringify(obj, null, 2)
  await Bun.write('dist/head.json', raw)
}

function pluginHeadToJson()
{
  return {
    name: 'vite-plugin-head-to-json',
    apply: 'build',
    async closeBundle()
    {
      const document = await getHtmlContent()
      const obj = convertElementToObject(document.querySelectorAll('head > *'))
      await writeFile(obj)
    },
  }
}

export default pluginHeadToJson
