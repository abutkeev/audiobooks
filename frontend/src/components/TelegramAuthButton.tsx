import { FC, PropsWithChildren, useEffect, useRef, useState } from 'react';
import ProgressButton, { ProgressButtonProps } from './common/ProgressButton';
import { Box } from '@mui/material';
import useWaitRefreshing from '../hooks/useWaitRefreshing';

// https://stackoverflow.com/questions/56347902/telegram-authorization-without-default-button/63593384#63593384
interface Options {
  bot_id: string;
  request_access?: boolean;
  lang?: string;
}

interface Data {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export type TelegramAuthCallback = (data: Data | false) => void | Promise<void>;

const getTelegramAuth = () => {
  if (
    !('Telegram' in window) ||
    !window.Telegram ||
    typeof window.Telegram !== 'object' ||
    !('Login' in window.Telegram) ||
    !window.Telegram.Login ||
    typeof window.Telegram.Login !== 'object' ||
    !('auth' in window.Telegram.Login) ||
    typeof window.Telegram.Login.auth !== 'function'
  ) {
    return false;
  }
  return window.Telegram.Login.auth as (options: Options, callback: TelegramAuthCallback) => void;
};

interface TelegramAuthButtonProps
  extends Pick<ProgressButtonProps, 'variant' | 'inProgress' | 'disabled' | 'refreshing'> {
  request_access?: boolean;
  lang?: string;
  onAuth: TelegramAuthCallback;
  progressButtonProps?: Omit<ProgressButtonProps, 'children' | 'onClick' | 'variant' | 'refreshing' | 'onEndWait'>;
}

const TelegramAuthButton: FC<PropsWithChildren<TelegramAuthButtonProps>> = ({
  children,
  variant = 'contained',
  inProgress,
  disabled,
  progressButtonProps,
  onAuth,
  request_access,
  lang,
  refreshing,
}) => {
  const scriptContainerRef = useRef<HTMLDivElement>(null);
  const [scriptLoading, setScriptLoading] = useState(true);
  const [scriptError, setScriptError] = useState(false);
  const [processing, setProcessing] = useState(false);
  const setWaitRefreshing = useWaitRefreshing(refreshing, () => setProcessing(false));

  useEffect(() => {
    if (!TELEGRAM_BOT_ID) {
      setScriptError(true);
      setScriptLoading(false);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js';
    script.onload = () => {
      setScriptLoading(false);
      if (!getTelegramAuth()) {
        setScriptError(true);
      }
    };
    script.onerror = () => setScriptError(true);
    scriptContainerRef.current?.appendChild(script);
    return () => {
      if ('Telegram' in window) {
        delete window.Telegram;
      }
    };
  }, []);

  if (!TELEGRAM_BOT_ID) return;

  const handleAuth = async (data: Data | false) => {
    setProcessing(true);
    try {
      await onAuth(data);
    } finally {
      setWaitRefreshing(true);
    }
  };

  const handleButtonClick = () => {
    const auth = getTelegramAuth();
    if (!auth) return;
    auth({ bot_id: TELEGRAM_BOT_ID, request_access, lang }, handleAuth);
  };

  return (
    <>
      <Box display='none' ref={scriptContainerRef} />
      <ProgressButton
        variant={variant}
        inProgress={inProgress || scriptLoading || processing}
        disabled={disabled || scriptError}
        onClick={handleButtonClick}
        {...progressButtonProps}
      >
        {children}
      </ProgressButton>
    </>
  );
};

export default TelegramAuthButton;
