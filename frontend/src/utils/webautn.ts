import { client } from '@passwordless-id/webauthn';
import type { AuthenticationDto, RegistrationDto } from '@/api/api';

export const webauthnAvailable = client.isAvailable();

// The backend (@abutkeev/webauthn, v1 format) expects a flat payload, while
// @passwordless-id/webauthn v2 nests everything under `response`. Map here so
// the mismatch is caught by types instead of crashing the server at parse time.
const coseAlgorithmToName = (algorithm: number): 'RS256' | 'ES256' => {
  switch (algorithm) {
    case -7:
      return 'ES256';
    case -257:
      return 'RS256';
    default:
      throw new Error(`unsupported key algorithm ${algorithm}`);
  }
};

interface RegisterSecurityKeyOptions {
  username: string;
  challenge: string;
}

export const registerSecurityKey = async ({
  username,
  challenge,
}: RegisterSecurityKeyOptions): Promise<RegistrationDto> => {
  const { id, response } = await client.register({ user: username, challenge });
  return {
    username,
    credential: {
      id,
      publicKey: response.publicKey,
      algorithm: coseAlgorithmToName(response.publicKeyAlgorithm),
    },
    authenticatorData: response.authenticatorData,
    clientData: response.clientDataJSON,
    attestationData: response.attestationObject,
  };
};

export const authenticateSecurityKey = async (challenge: string): Promise<AuthenticationDto> => {
  const { id, response } = await client.authenticate({ allowCredentials: [], challenge });
  return {
    credentialId: id,
    authenticatorData: response.authenticatorData,
    clientData: response.clientDataJSON,
    signature: response.signature,
  };
};
