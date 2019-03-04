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
