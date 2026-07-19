import ServiceError from '../classes/ServiceError.js'
import { filteringQuery } from './util.js'

const { API_URL, API_TOKEN, APP_SRL, APP_INDEX_SIZE } = Bun.env

export let apiAssets = {
  appSrl: Number(APP_SRL),
  size: Number(APP_INDEX_SIZE),
  field: 'a.srl,a.nest_srl,a.category_srl,a.title,a.regdate,a.json',
}

/**
 * form data
 * @param {object} src
 * @return {FormData}
 */
function formData(src)
{
  if (!src) return null
  let data = new FormData()
  Object.keys(src).forEach(o => data.append(o, src[o]))
  return data
}

/**
 * parse response body
 * @param {Response} res
 * @return {Promise<object|string|null>}
 */
async function parseResponseBody(res)
{
  if (res.status === 204) return null
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json'))
  {
    return await res.json()
  }
  const text = await res.text()
  if (!text) return null
  try
  {
    return JSON.parse(text)
  }
  catch
  {
    return text
  }
}

/**
 * request
 * @param {string} path
 * @param {object} options
 * @param {boolean} debug 디버그 모드
 * @return {Promise}
 */
export async function requestApi(path, options = {}, debug = false)
{
  const { method, query, json, data } = options
  // set url
  let url = `${API_URL}${path}`
  // set query
  if (query)
  {
    const _query = new URLSearchParams(filteringQuery(query))
    url += `?${_query}`
  }
  // set request options
  let _options = {
    method: method || 'get',
    headers: {
      'Authorization': API_TOKEN,
      'Content-Type': 'application/json',
    },
    verbose: debug,
  }
  // set body
  if (json) _options.body = JSON.stringify(json)
  else if (data) _options.body = formData(data)
  // request to API
  const res = await fetch(url, _options)
  if (!res.ok)
  {
    throw new ServiceError('Failed API request.', {
      status: res.status,
      text: res.statusText,
    })
  }
  // return response
  return await parseResponseBody(res)
}
