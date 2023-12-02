import { useLazyProfileGetSettingsQuery, useProfileSetSettingsMutation } from '@/api/api';
import auth from '@/store/features/auth';
import { TextFieldProps } from '@mui/material';
import { useEffect, useState } from 'react';

const useSelectedTheme = () => {
  const [getSettings, { status }] = useLazyProfileGetSettingsQuery();
  const [setSettings] = useProfileSetSettingsMutation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'auto');

  useEffect(() => {
    if (!auth || !['uninitialized', 'fulfilled'].includes(status)) return;
    getSettings(undefined, true)
      .unwrap()
      .then(settings => {
        if (settings?.theme && settings.theme !== theme) {
          setTheme(settings.theme);
        }
      });
  }, [status]);

  const handleThemeChange: TextFieldProps['onChange'] = async ({ target: { value } }) => {
    setTheme(value);
    if (auth) {
      await setSettings({ settingsDto: { theme: value } });
    }
  };
  return [theme, handleThemeChange] as const;
};

export default useSelectedTheme;
