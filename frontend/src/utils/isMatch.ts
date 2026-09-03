import { convert_en2ru } from './convert-layout';

interface IsMatchOptions {
  searchString: string;
  value: string;
}

// е and ё are interchangeable: a title spelled either way must be found by both
const normalize = (value: string) => value.toLocaleLowerCase().replace(/ё/g, 'е');

const isMatch = ({ searchString, value }: IsMatchOptions) => {
  const normalizedValue = normalize(value);
  return (
    normalizedValue.includes(normalize(searchString)) ||
    normalizedValue.includes(normalize(convert_en2ru(searchString, 'pc'))) ||
    normalizedValue.includes(normalize(convert_en2ru(searchString, 'mac')))
  );
};

export default isMatch;
