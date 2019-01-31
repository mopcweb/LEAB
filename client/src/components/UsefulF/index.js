import { transliterate as tr, slugify } from 'transliteration';

export const capitalize = (data) => {
  return data.slice(0,1).toUpperCase() + data.slice(1).toLowerCase()
};

// export const makeURL = (data) => {
//   return data.replace(/\s/gi, '-').toLowerCase()
// };

export const makeURL = data => {
  return slugify(data)
};

export const replaceSigns = (data) => {
  return data.replace(/-/gi, ' ')
};

export const fetchData = (url, filename, storeTo) => {
  fetch(url, {headers: {'data': filename}})
    .then(res => res.json())
    .then(data => data)
    .catch(err => console.log(err))
};
