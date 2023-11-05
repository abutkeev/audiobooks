import { FC, useEffect } from 'react';
import { GoogleReCaptchaProvider, GoogleReCaptcha } from 'react-google-recaptcha-v3';

interface ReCaptchaProps {
  setToken(v: string): void;
}

const ReCaptcha: FC<ReCaptchaProps> = ({ setToken }) => {
  useEffect(
    () => () => {
      // remove recapcha on umount
      document.getElementById('google-recaptcha-v3')?.remove();
      if ('grecaptcha' in window) {
        delete window.grecaptcha;
      }
    },
    []
  );

  return (
    <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY}>
      <GoogleReCaptcha onVerify={setToken} refreshReCaptcha />
    </GoogleReCaptchaProvider>
  );
};

export default ReCaptcha;
