import { PATH_DIST } from '../libs/assets.js'

class Meta {

  title = ''
  meta = {}
  link = {}

  constructor()
  {}

  async setup()
  {
    const data = await this.#loadFile()
    if (data)
    {
      this.title = data.title
      this.meta = data.meta
      this.link = data.link
    }
    else
    {
      // head 파일이 없으므로 새로 만든다. (for DEV)
      const script = require('../../plugins/headToJson.js')
      if (!script?.default)
      {
        throw new Error('Failed to load headToJson plugin.')
      }
      await script.default().closeBundle()
      const data = await this.#loadFile()
      if (data)
      {
        this.title = data.title
        this.meta = data.meta
        this.link = data.link
      }
      else
      {
        throw new Error('Failed to load "head.json" file.')
      }
    }
  }

  async #loadFile()
  {
    const file = Bun.file(`${PATH_DIST}/head.json`)
    if (await file.exists())
    {
      return await file.json()
    }
    else
    {
      return null
    }
  }

}

export default Meta

export const html = new Meta()
