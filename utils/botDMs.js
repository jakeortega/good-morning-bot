const { fetchMorningGif, getRandomEmoji } = require('./index');

module.exports = async app => {
  app.message(/gm/, async ({ message, say }) => {
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
