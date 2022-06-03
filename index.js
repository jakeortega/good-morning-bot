const { App, LogLevel } = require("@slack/bolt");
const { isWeekend, getRandomEmoji, fetchMorningGif } = require("./utils");
const botDMs = require("./botDMs");

const { SLACK_TOKEN, SLACK_USER_TOKEN, SLACK_SIGNING_SECRET, SLACK_APP_TOKEN, USER_ID, GENERAL_CHANNEL_ID, PORT } =
  process.env;

const app = new App({
  token: process.env.SLACK_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  logLevel: LogLevel.DEBUG,
});

(async () => {
  const port = 3000;

  await app.start(process.env.PORT || port);
  await botDMs(app);

  console.log(`🔥 Slack Bolt app is running on port ${port}! 🔥`);
})();

/* Scheduled Good Morning */

const NUMBER_OF_DAYS = 5;
let daysGreeted = [];
// TODO add a command that adds to daysGreeted and subtracts from the NUMBER_OF_DAYS array if there's a day off

const sendMessage = async () => {
  const gif = await fetchMorningGif();

  await app.client.chat.postMessage({
    token: as_user ? SLACK_USER_TOKEN : SLACK_TOKEN,
    channel,
    text: `Good morning! ${getRandomEmoji()}\n ${gif}`,
    as_user
  });
};
// sendMessage();

function loop() {
  setTimeout(() => {
    const day = new Date().getDay();
    const hour = new Date().getHours();
    const isSentToday = daysGreeted.includes(day);
    const isMorning = hour >= 8 && hour <= 9;

    if (!isSentToday && !isWeekend() && isMorning) {
      sendMessage();
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
