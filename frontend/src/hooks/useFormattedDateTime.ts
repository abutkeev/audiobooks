import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const useFormattedDateTime = (date?: Date, timeStyle: 'medium' | 'short' = 'short') => {
  const { t } = useTranslation();

  const todayDateString = new Date().toDateString();
  const yesterdayDateString = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

  const formattedDate = useMemo(() => {
    if (!date) return undefined;

    if (todayDateString === date.toDateString()) {
      return t('today');
    }

    if (yesterdayDateString === date.toDateString()) {
      return t('yesterday');
    }

    return Intl.DateTimeFormat(undefined, {
      dateStyle: 'short',
    }).format(new Date(date));
  }, [date, todayDateString, yesterdayDateString, t]);

  const formattedDateTime = useMemo(() => {
    if (!date) return undefined;

    const time = Intl.DateTimeFormat(undefined, { timeStyle }).format(new Date(date));
    return t('{{date}} at {{time}}', { date: formattedDate, time, interpolation: { escapeValue: false } });
  }, [formattedDate, timeStyle, date, t]);

  return formattedDateTime;
};

export default useFormattedDateTime;
