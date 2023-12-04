import useFormattedDateTime from '@/hooks/useFormattedDateTime';
import useUpdatingState from '@/hooks/useUpdatingState';
import { Circle } from '@mui/icons-material';
import { SvgIconProps, Tooltip } from '@mui/material';
import { FC, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface UserOnlineIndicatorProps {
  online?: string;
}

interface IndicatorProps {
  color: SvgIconProps['color'];
  tooltip: string;
}

const Indicator: FC<IndicatorProps> = ({ color, tooltip }) => {
  return (
    <Tooltip title={tooltip}>
      <Circle sx={{ fontSize: 10, mr: 0.5 }} color={color} />
    </Tooltip>
  );
};

const UserOnlineIndicator: FC<UserOnlineIndicatorProps> = ({ online }) => {
  const { t } = useTranslation();
  const lastSeenTime = useMemo(() => {
    if (!online) return undefined;
    try {
      return new Date(online);
    } catch {
      return undefined;
    }
  }, [online]);

  const [isOnline, setIsOnline] = useUpdatingState(
    !!lastSeenTime && new Date().getTime() - lastSeenTime.getTime() < 5 * 60 * 1000
  );

  useEffect(() => {
    if (!lastSeenTime) return;
    const timerId = setTimeout(() => setIsOnline(false), new Date().getTime() - lastSeenTime.getTime() + 5 * 60 * 1000);
    return () => clearTimeout(timerId);
  }, [lastSeenTime, setIsOnline]);

  const formattedDateTime = useFormattedDateTime(lastSeenTime);

  const lastSeenTooltip = useMemo(() => {
    return t('Last seen {{formattedDateTime}}', { formattedDateTime });
  }, [formattedDateTime, t]);

  if (!lastSeenTime) {
    return <Indicator color='disabled' tooltip={t('Offline')} />;
  }

  if (isOnline) {
    return <Indicator color='success' tooltip={t('Online')} />;
  }

  return <Indicator color='error' tooltip={lastSeenTooltip || t('Offline')} />;
};

export default UserOnlineIndicator;
