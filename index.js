const { App, LogLevel } = require("@slack/bolt");
const {
  isWeekend,
  getRandomGif,
  getRandomEmoji,
  fetchMorningGif,
} = require("./utils");

require("dotenv").config();

const app = new App({
  token: process.env.SLACK_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  logLevel: LogLevel.DEBUG,
});

app.message(/gm/, async ({ message, say }) => {
  const gifUrl = await fetchMorningGif();

  await say({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Good morning ${getRandomEmoji()} <@${message.user}>!\n${gifUrl}
          `,
        },
      },
    ],
    text: `Good morning ${getRandomEmoji()} <@${message.user}>!\n${gifUrl}`,
  });
});

(async () => {
  const port = 3000;

  await app.start(process.env.PORT || port);
  console.log(`🔥 Slack Bolt app is running on port ${port}! 🔥`);
})();

/* Scheduled Good Morning */

const NUMBER_OF_DAYS = 5;
let daysGreeted = [];
// TODO add a command that adds to daysGreeted and subtracts from the NUMBER_OF_DAYS array if there's a day off

function loop() {
  setTimeout(() => {
    const day = new Date().getDay();
    const hour = new Date().getHours();
    const isSentToday = daysGreeted.includes(day);

    if (!isWeekend() && !isSentToday && hour >= 9 && hour <= 10) {
      app.client.chat.postMessage({
        token: process.env.SLACK_TOKEN,
        channel: "general",
        text: "Good morning! ☀️\n" + getRandomGif(),
        as_user: true,
      });
      daysGreeted.push(day);
    }

    if (daysGreeted.length === NUMBER_OF_DAYS) {
      daysGreeted = [];
    }

    console.log({ daysGreeted, isSentToday });
    loop();
  }, 1000 * 60 * 30 * Math.random());
}

loop();
