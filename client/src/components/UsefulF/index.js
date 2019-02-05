// import { transliterate as tr, slugify } from 'transliteration';
import { slugify } from 'transliteration';

// Capitalize string
export const capitalize = (data) => {
  return (data.slice(0,1).toUpperCase() + data.slice(1).toLowerCase()).replace(/\s*/, '')
};

// export const makeURL = (data) => {
//   return data.replace(/\s/gi, '-').toLowerCase()
// };

// Transliterate, change ' ' with '-' and remove more than 1 ' ' in a row -> make a url
export const makeURL = data => {
  return slugify(data)
};

// Replacing '-' in the string
export const replaceSigns = (data) => {
  return data.replace(/-/gi, ' ').trim()
};

export const fetchData = (url, filename, storeTo) => {
  fetch(url, {headers: {'data': filename}})
    .then(res => res.json())
    .then(data => data)
    .catch(err => console.log(err))
};

// Standart fetch + error handling + custom json() parsing of response
export const request = (url, options?) => {
  return fetch(url, options)
    .then(res => {
      if (res.ok) return res.json()
      throw Error(res.status);
    })
};
