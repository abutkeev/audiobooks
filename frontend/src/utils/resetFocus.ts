const resetFocus = () => {
  setTimeout(() => {
    if (
      document.activeElement &&
      'blur' in document.activeElement &&
      typeof document.activeElement.blur === 'function'
    ) {
      document.activeElement.blur();
    }
  });
};

export default resetFocus;
