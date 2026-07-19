import { PATH_DIST } from '../libs/assets.js'

class Meta {

  title = ''
  meta = {}
  link = {}

  constructor()
  {}

  async setup()
  {
    let data = await this.#loadFile()
    if (!data && !Bun.env.USE_BUILD)
    {
      // Generate metadata only for the unbundled development server. The
      // production bundle must not include this build-only jsdom dependency.
      const script = require('../../plugins/headToJson.js')
      if (!script?.default)
      {
        throw new Error('Failed to load headToJson plugin.')
      }
      await script.default().closeBundle()
      data = await this.#loadFile()
    }
    if (!data)
    {
      throw new Error('Failed to load "head.json" file.')
    }
    this.title = data.title
    this.meta = data.meta
    this.link = data.link
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
