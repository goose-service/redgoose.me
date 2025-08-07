/**
 * ServiceError class
 *
 * @example
 * ```
 * throw new ServiceError('오류 메시지', { status, text, _err, _res })
 * ```
 */
class ServiceError {

  /**
   * Constructor
   * @param {string} message 공개된 오류 메시지
   * @param {object} options
   * @param {number} [options.status] http 상태 코드
   * @param {number} [options.text] 디테일한 오류 메시지
   * @param {Error} [options._err] 내부 오류 객체
   * @param {any} [options._data] 추가 데이터
   */
  constructor(message, options = {})
  {
    const { status, text, _err, _data } = options
    this.message = message
    this.status = status || 500
    this.statusText = text || message
    this.error = _err || undefined
    if (_data) this.data = _data
  }

}

export default ServiceError
