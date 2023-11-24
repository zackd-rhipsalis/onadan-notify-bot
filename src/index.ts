import { EventSubHttpListener } from '@twurple/eventsub-http';
import { NgrokAdapter } from '@twurple/eventsub-ngrok';
import { AppTokenAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import { notify } from './notify';
import { useEnv } from './env';

export const eventsub = async () => {
  const adapter = new NgrokAdapter();
  const authProvider = new AppTokenAuthProvider(useEnv('clientId'), useEnv('clientSecret'));
  const apiClient = new ApiClient({ authProvider });

  await apiClient.eventSub.deleteAllSubscriptions();

  const listener = new EventSubHttpListener({ adapter, apiClient, secret: useEnv('hmacSecret') });

  listener.onSubscriptionCreateSuccess(() => console.log('サブスクリプション作成成功'));
  listener.onSubscriptionCreateFailure(() => console.log('サブスクリプション作成失敗'));

  listener.onStreamOnline(useEnv('onadanId'), e => {
    console.log(`${e.broadcasterDisplayName}がオンラインになりました。`);
    notify(`${e.broadcasterDisplayName}がオンラインになりました。\ntwitch.tv/${e.broadcasterId}?openExternalBrowser=1`);
  });

  listener.start();

  ['SIGINT', 'SIGHUP', 'SIGTERM'].forEach(e => process.on(e, async () => {
    await apiClient.eventSub.deleteAllSubscriptions();
    listener.stop();
    process.exit(0);
  }));
}

eventsub();