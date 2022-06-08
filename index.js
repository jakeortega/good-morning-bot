const { App, LogLevel } = require('@slack/bolt');
const { isWeekend, getRandomEmoji, fetchMorningGif } = require('./utils');
const botDMs = require('./utils/botDMs');
const { isDayOff } = require('./utils/dayOff');

require('dotenv').config();

const { SLACK_BOT_TOKEN, SLACK_USER_TOKEN, SLACK_SIGNING_SECRET, SLACK_APP_TOKEN, NODE_ENV } = process.env;

const HOUR_DIFFERENCE = 3;

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
})();

/* Scheduled Good Morning */

const sendMessage = async ({ channel = 'general', as_user = true } = {}) => {
  const gif = await fetchMorningGif();

  await app.client.chat.postMessage({
    token: as_user ? SLACK_USER_TOKEN : SLACK_BOT_TOKEN,
    channel,
    text: `Good morning! ${getRandomEmoji()}\n ${gif}`,
    as_user
  });
};

let isSentToday = false;
let prevDay = new Date().getDay();

(function loop() {
  setTimeout(() => {
    const day = new Date().getDay();
    const hour = new Date().getHours() + HOUR_DIFFERENCE;
    const isMorning = hour === 21;

    console.log({ hour, day, prevDay });

    if (prevDay !== day) {
      isSentToday = false;
      prevDay = day;
    }

    if (!isSentToday && !isWeekend() && isMorning) {
      if (!isDayOff()) {
        sendMessage();
        isSentToday = true;
        console.log('!!! Sent a good morning message !!!');
      }
    }

    console.log({ isSentToday, prevDay, day });
    loop();
  }, 1000 /* * 60 * 30 * Math.random() */);
})();
