/**
 * ajax
 * 비동기 통신을 위한 `XMLHttpRequest` 객체의 인터페이스
 *
 * @param {string} url
 * @param {string} method
 * @return {promise}
 */
export function ajax(url='', method='get')
{
  return new Promise(function(resolve, reject, notify) {
    if (!XMLHttpRequest) reject(`Not support browser`);
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function() {
      if (this.status === 200 || this.status === 201)
      {
        resolve(this.responseText);
      }
      else
      {
        reject(this.responseText);
      }
    });
    xhr.addEventListener('error', function() {
      reject('error request');
    });
    xhr.open(method, url);
    xhr.send();
  });
}

/**
 * check touch device
 *
 * @return {boolean}
 */
export const isTouchDevice = function()
{
  try
  {
    document.createEvent('TouchEvent');
    return true;
  }
  catch (e)
  {
    return false;
  }
};
