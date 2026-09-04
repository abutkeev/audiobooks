import { t } from 'i18next';

// digits are chosen by the rounded value too, otherwise 102399 shows as 100.0 KB and 102400 as 100 KB
const fractionDigits = (value: number, unit: number) => (unit !== 0 && +value.toFixed(1) < 100 ? 1 : 0);

const formatSize = (size: number) => {
  const units = [t('B'), t('KB'), t('MB'), t('GB')];
  let value = size;
  let unit = 0;

  // the rounded value is compared, otherwise 1048575 bytes read as 1024 KB instead of 1.0 MB
  while (unit < units.length - 1 && +value.toFixed(fractionDigits(value, unit)) >= 1024) {
    value /= 1024;
    unit += 1;
  }

  return `${value.toFixed(fractionDigits(value, unit))} ${units[unit]}`;
};

export default formatSize;
