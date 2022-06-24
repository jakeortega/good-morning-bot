import { fetchMorningGif, getRandomEmoji } from '.';
import { App, GenericMessageEvent, MessageEvent } from '@slack/bolt';

const isGenericMessageEvent = (msg: MessageEvent): msg is GenericMessageEvent =>
  (msg as GenericMessageEvent).subtype === undefined;

export default async (app: App) => {
  app.message(/gm/, async ({ message, say }) => {
    if (!isGenericMessageEvent(message)) return;

    const gifUrl = await fetchMorningGif();

    await say({
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Good morning ${getRandomEmoji()} <@${message.user}>!\n${gifUrl}`
          }
        }
      ]
    });
  });
};
