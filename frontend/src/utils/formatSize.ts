import { t } from 'i18next';

const formatSize = (size: number) => {
  const units = [t('B'), t('KB'), t('MB'), t('GB')];
  let value = size;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(unit !== 0 && value < 100 ? 1 : 0)} ${units[unit]}`;
};

export default formatSize;
