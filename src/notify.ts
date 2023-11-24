import { useEnv } from './env';
import { messagingApi, type HTTPError } from '@line/bot-sdk';

export const notify = (text: string) => {
  const client = new messagingApi.MessagingApiClient({
    channelAccessToken: useEnv('channelAccessToken')
  });

  client.pushMessage({ to: useEnv('uuid'), messages: [{ type: 'text', text }] })
  .catch((err: HTTPError) => {
    console.log(`メッセージの送信に失敗しました。${err.originalError.response.data}`);
  });
}