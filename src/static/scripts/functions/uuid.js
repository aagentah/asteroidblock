/* eslint-disable */

export function uuid() {
  let d = new Date().getTime();
  const guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return guid;
}

// generate uuid RFC4122 version 4
// export const uuid = () =>
//   ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
//     (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
//   );
