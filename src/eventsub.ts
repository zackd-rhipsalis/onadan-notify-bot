import { EnvPortAdapter, EventSubHttpListener } from '@twurple/eventsub-http';
import { AppTokenAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import { notify } from './notify.ts';
import { useEnv } from './env/index.ts';

export const eventsub = async () => {
  const adapter = new EnvPortAdapter({ hostName: useEnv('hostName') });
  const authProvider = new AppTokenAuthProvider(useEnv('clientId'), useEnv('clientSecret'));
  const apiClient = new ApiClient({ authProvider });

  await apiClient.eventSub.deleteAllSubscriptions();

  const listener = new EventSubHttpListener({ adapter, apiClient, secret: useEnv('hmacSecret') });

  listener.onSubscriptionCreateSuccess(async e => {
    console.log(`サブスクリプション成功\n CLIテストコマンド: ${await e.getCliTestCommand()}`);
  });
  listener.onSubscriptionCreateFailure(() => console.log(`サブスクリプション失敗`));

  listener.onStreamOnline(useEnv('onadanId'), e => {
    console.log(`${e.broadcasterDisplayName}がオンラインになりました。`);
    notify(`${e.broadcasterDisplayName}がオンラインになりました。\ntwitch.tv/${e.broadcasterName}?openExternalBrowser=1`);
  });

  listener.start();

  process.on('SIGINT', async () => {
    await apiClient.eventSub.deleteAllSubscriptions();
    listener.stop();
    process.exit(0);
  });
}