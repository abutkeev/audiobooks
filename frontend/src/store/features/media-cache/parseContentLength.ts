// zero or non numeric content-length means the size is unknown, not empty
const parseContentLength = (value?: string | null) => {
  const size = Number(value);
  return size > 0 ? size : undefined;
};

export default parseContentLength;
