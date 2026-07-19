import { JSDOM } from 'jsdom'
import { mkdir } from 'node:fs/promises'

async function getHtmlContent()
{
  let htmlFile = Bun.file('dist/client/index.html')
  if (!(await htmlFile.exists())) htmlFile = Bun.file('client/index.html')
  if (!(await htmlFile.exists()))
  {
    throw new Error('Failed to load client index.html.')
  }
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
  await mkdir('dist/client', { recursive: true })
  await Bun.write('dist/client/head.json', raw)
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
