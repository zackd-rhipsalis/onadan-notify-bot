import { ApiClient } from '@twurple/api';
import { useEnv } from './env/index.ts';
import { notify } from './notify.ts';

export const getStream = async (apiClient: ApiClient) => {
  const [ stream ] = await apiClient.streams.getStreamsByUserIds([useEnv('onadanId')]);

  if (stream) {
    console.log(`${stream.userDisplayName}がオンラインになりました。`);
    notify(`${stream.userDisplayName}がオンラインになりました。\ntwitch.tv/${stream.userName}?openExternalBrowser=1`);
  }
}