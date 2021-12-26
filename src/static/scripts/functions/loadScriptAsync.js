export function loadScriptAsync(src, callback) {
  const wf = document.createElement('script');
  const s = document.getElementsByTagName('script')[0];
  wf.src = src;
  wf.async = 'true';
  if (callback) {
    wf.onload = callback;
  }
  s.parentNode.insertBefore(wf, s);
}
