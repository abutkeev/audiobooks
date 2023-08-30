const getExtensionByMimeType = (type: string) => {
  switch (type) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/png':
      return 'png';
  }
  return undefined;
};

export default getExtensionByMimeType;
