import ServiceError from './ServiceError.js'

const { COOKIE_MAX_AGE, COOKIE_DOMAIN, COOKIE_HTTP_ONLY, COOKIE_SECURE } = Bun.env
const defaultOptions = {
  maxAge: Number(COOKIE_MAX_AGE), // 7 days
  sameSite: 'strict',
  domain: COOKIE_DOMAIN,
  httpOnly: COOKIE_HTTP_ONLY === 'true',
  secure: COOKIE_SECURE === 'true',
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
