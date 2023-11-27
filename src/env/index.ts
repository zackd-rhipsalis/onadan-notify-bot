import { assertIsDefined, type Envs } from '../types/index.ts';

const env = (key: string) => process.env[key];

const envs: Envs = {
  clientId: env('CLIENT_ID'),
  clientSecret: env('CLIENT_SECRET'),
  onadanId: env('ONADAN_USER_ID'),
  uuid: env('LINE_USER_ID'),
  channelAccessToken: env('LINE_CHANNEL_ACCESS_TOKEN'),
  hmacSecret: env('HMAC_SECRET'),
  hostName: env('HOST_NAME')
}

export const useEnv = (key: keyof Envs): string => {
  const _envs = { [key]: envs[key] }
  assertIsDefined(_envs);

  return _envs[key];
}