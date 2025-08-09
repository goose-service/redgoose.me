import ServiceError from './ServiceError.js'

const { HOST, URL_PATH } = Bun.env
const defaultOptions = {
  maxAge: 60 * 60 * 24 * 7, // 7 days
  sameSite: 'strict',
  domain: HOST,
  httpOnly: true,
  secure: /^https/.test(URL_PATH),
}

class ServiceCookie {

  constructor(req, options = {})
  {
    if (!req?.cookies)
    {
      throw new ServiceError('Request does not have cookies.')
    }
    this.cookie = req.cookies
    this.options = {
      ...defaultOptions,
      ...options,
    }
  }

  getValue(key)
  {
    if (!this.cookie) return null
    return this.cookie.get(key) || null
  }

  existValue(key)
  {
    if (!this.cookie) return false
    return this.cookie.has(key)
  }

  setValue(key, value, options = {})
  {
    this.cookie.set(key, value, {
      ...this.options,
      ...options,
    })
  }

}

export default ServiceCookie
