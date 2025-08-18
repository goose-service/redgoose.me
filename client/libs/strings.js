/**
 * 카멜케이스 문자로 변경
 * @param {string} str
 * @return {string}
 */
export function toCamelCase(str)
{
  return str.replace(/(\w)(\w*)(_|-|\s*)/g, (g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase())
}

/**
 * serialize object to query string
 * @param {object} obj
 * @param {boolean} usePrefix
 * @param {boolean} useEncode
 * @return {string}
 */
export function serialize(obj, usePrefix = false, useEncode = true)
{
  let str = []
  let res
  for (let p in obj)
  {
    if (!obj.hasOwnProperty(p) || obj[p] === undefined || obj[p] === null) continue
    if (typeof obj[p] === 'number' && isNaN(obj[p])) continue
    const value = useEncode ? encodeURIComponent(obj[p]) : obj[p]
    str.push(encodeURIComponent(p) + '=' + value)
  }
  res = str.join('&')
  return (res && usePrefix ? '?' : '') + res
}

/**
 * 숫자 한자리라면 앞에 `0`을 붙인다.
 */
export function twoDigit(day)
{
  return `0${day}`.slice(-2)
}

/**
 * convert date format
 * guide: `{yyyy}-{MM}-{dd} {hh}:{mm}:{ss}`
 * @param {Date} date
 * @param {string} format
 * @returns {string}
 */
export function dateFormat(date, format)
{
  if (!date) date = new Date()
  let mix = format.replace(/\{yyyy\}/, String(date.getFullYear()))
  mix = mix.replace(/\{MM\}/, twoDigit(date.getMonth() + 1))
  mix = mix.replace(/\{dd\}/, twoDigit(date.getDate()))
  mix = mix.replace(/\{hh\}/, twoDigit(date.getHours()))
  mix = mix.replace(/\{mm\}/, twoDigit(date.getMinutes()))
  mix = mix.replace(/\{ss\}/, twoDigit(date.getSeconds()))
  return mix
}
