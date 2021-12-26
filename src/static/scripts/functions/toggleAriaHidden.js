export function toggleAriaHidden(elem) {
  const attr = elem.attributes;

  if (attr['aria-hidden'].value === 'true') {
    elem.setAttribute('aria-hidden', 'false');
  } else {
    elem.setAttribute('aria-hidden', 'true');
  }
}
