import { client } from '@passwordless-id/webauthn';

export const webauthnAvailable = client.isAvailable();

interface RegisterSecurityKeyOptions {
  username: string;
  challenge: string;
}

export const registerSecurityKey = ({ username, challenge }: RegisterSecurityKeyOptions) => {
  return client.register(username, challenge);
};
