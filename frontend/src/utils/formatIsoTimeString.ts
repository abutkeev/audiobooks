import { t } from 'i18next';

const formatIsoTimeString = (isoTimeString?: string): string => {
  if (!isoTimeString) {
    return t('not set');
  }
  try {
    const date = new Date(isoTimeString);
    if (!date.getSeconds() && !date.getMinutes() && !date.getHours()) {
      return date.toLocaleDateString();
    }
    return date.toLocaleString();
  } catch {
    return isoTimeString;
  }
};

export default formatIsoTimeString;
