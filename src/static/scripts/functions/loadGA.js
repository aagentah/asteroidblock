/* global ga */
/* eslint-disable prefer-rest-params */

export function loadGA(hostname, gaId) {
  if (!gaId || !hostname) {
    throw new Error('App missing property gaId or hostname.');
  }

  if (
    window.location.hostname === hostname ||
    window.location.hostname === `www.${hostname}`
  ) {
    // prettier-ignore
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create', gaId, 'auto');
    ga('send', 'pageview');
  }
}
