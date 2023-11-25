import fs from 'fs';
import os from 'os';
import { DirectConnectionAdapter, EventSubHttpListener } from '@twurple/eventsub-http';
import { AppTokenAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import { notify } from './notify';
import { useEnv } from './env';

const sslKey = fs.readFileSync(useEnv('pemKey')).toString();
const sslCert = fs.readFileSync(useEnv('pemChain')).toString();

const eventsub = async () => {
  const adapter = new DirectConnectionAdapter({
    hostName: os.hostname(),
    sslCert: {
      key: sslKey,
      cert: sslCert
    }
  });
  const authProvider = new AppTokenAuthProvider(useEnv('clientId'), useEnv('clientSecret'));
  const apiClient = new ApiClient({ authProvider });

  await apiClient.eventSub.deleteAllSubscriptions();

  const listener = new EventSubHttpListener({ adapter, apiClient, secret: useEnv('hmacSecret') });

  const getSubs = apiClient.eventSub.getSubscriptions;

  listener.onSubscriptionCreateSuccess(async () => console.log(`サブスクリプション成功\n${await getSubs()}`));
  listener.onSubscriptionCreateFailure(async () => console.log(`サブスクリプション失敗\n${await getSubs()}`));

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