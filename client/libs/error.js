class ServiceError extends Error {

  static SERVICE_UNAVAILABLE_MESSAGE = '현재 서비스가 일시적으로 이용할 수 없습니다. 잠시 후 다시 시도해 주세요.'

  static from(error)
  {
    const candidates = [
      error?.response?.status,
      error?.statusCode,
      error?.status,
    ]
    const code = candidates.find(value => {
      const status = Number(value)
      return status >= 400 && status <= 599
    })
    const rawStatus = Number(code) || 503
    const status = rawStatus === 401 ? 503 : rawStatus
    let message = error?.message || '서비스를 불러오지 못했어요.'
    if (status === 503 || rawStatus === 401 || !code)
    {
      message = ServiceError.SERVICE_UNAVAILABLE_MESSAGE
    }
    else if (status >= 500)
    {
      message = '서비스를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.'
    }
    return new ServiceError(message, status)
  }

  constructor(message, code = 500)
  {
    super(message)
    this.name = 'ServiceError'
    this.code = code
  }

}

export default ServiceError
