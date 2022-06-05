// TODO Migrate to typescript
const { App, LogLevel } = require('@slack/bolt');
const { isWeekend, getRandomEmoji, fetchMorningGif } = require('./utils');
const botDMs = require('./utils/botDMs');
const { isDayOff } = require('./utils/dayOff');

require('dotenv').config();

const { SLACK_BOT_TOKEN, SLACK_USER_TOKEN, SLACK_SIGNING_SECRET, SLACK_APP_TOKEN, USER_ID } = process.env;

const app = new App({
  token: SLACK_BOT_TOKEN,
  signingSecret: SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: SLACK_APP_TOKEN,
  logLevel: LogLevel.DEBUG
});

(async () => {
  await app.start();
  await botDMs(app);

  console.log(`🔥 Slack Bolt app is running! 🔥`);
  // console.log(`🔥 Slack Bolt app is running on port ${port}! 🔥`);
  await sendMessage(); // TODO Remove this line
})();

/* Scheduled Good Morning */

const NUM_OF_WORK_DAYS = 5;
let daysGreeted = [];
let daysOffCount = 0;

const sendMessage = async ({ channel = 'general', as_user = true } = {}) => {
  const gif = await fetchMorningGif();

  await app.client.chat.postMessage({
    token: as_user ? SLACK_USER_TOKEN : SLACK_BOT_TOKEN,
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
      if (!isDayOff()) {
        sendMessage();
        daysGreeted.push(day);
      } else {
        daysOffCount++;
      }
    }

    if (daysGreeted.length === NUM_OF_WORK_DAYS - daysOffCount) {
      daysGreeted = [];
      daysOffCount = 0;
    }

    console.log({ daysGreeted, isSentToday });
    loop();
  }, 1000 * 60 * 30 * Math.random());
})();
