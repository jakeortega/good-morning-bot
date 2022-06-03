const { App, LogLevel } = require('@slack/bolt');
const { isWeekend, getRandomEmoji, fetchMorningGif } = require('./utils');
const botDMs = require('./utils/botDMs');

require('dotenv').config();
const { SLACK_TOKEN, SLACK_USER_TOKEN, SLACK_SIGNING_SECRET, SLACK_APP_TOKEN, USER_ID, GENERAL_CHANNEL_ID, PORT } =
  process.env;

const app = new App({
  token: SLACK_TOKEN,
  signingSecret: SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: SLACK_APP_TOKEN,
  logLevel: LogLevel.DEBUG
});

(async () => {
  const port = 3000;

  await app.start(PORT || port);
  await botDMs(app);

  console.log(`🔥 Slack Bolt app is running on port ${port}! 🔥`);
  await sendMessage();
})();

/* Scheduled Good Morning */
// TODO add a command that adds to daysGreeted and subtracts from the NUMBER_OF_DAYS array if there's a day off

const NUM_OF_WORK_DAYS = 5;
let daysGreeted = [];

const sendMessage = async ({ channel = GENERAL_CHANNEL_ID, as_user = true } = {}) => {
  const gif = await fetchMorningGif();

  await app.client.chat.postMessage({
    token: as_user ? SLACK_USER_TOKEN : SLACK_TOKEN,
    channel,
    text: `Good morning! ${getRandomEmoji()}\n ${gif}`,
    as_user
  });
};

(function loop() {
  setTimeout(() => {
    const day = new Date().getDay();
    const hour = new Date().getHours();
    const isSentToday = daysGreeted.includes(day);
    const isMorning = hour >= 8 && hour <= 9;

    if (!isSentToday && !isWeekend() && isMorning) {
      sendMessage();
      daysGreeted.push(day);
    }

    if (daysGreeted.length === NUM_OF_WORK_DAYS) {
      daysGreeted = [];
    }

    console.log({ daysGreeted, isSentToday });
    loop();
  }, 1000 * 60 * 30 * Math.random());
})();
