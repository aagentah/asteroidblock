/* eslint-disable */

// Get url params
// https://davidwalsh.name/query-string-javascript
export function getUrlParams(item) {
  item = item.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp('[\\?&]' + item + '=([^&#]*)');
  const results = regex.exec(location.search);
  return results === null
    ? ''
    : decodeURIComponent(results[1].replace(/\+/g, ' '));
}
