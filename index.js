const { App, LogLevel } = require("@slack/bolt");
const fetch = require("node-fetch-commonjs");
const data = require("./data.json");
require("dotenv").config();

const now = () => Math.floor(Date.now() / 1000);

const getRandomGif = () =>
  data.data[Math.floor(Math.random() * data.data.length)].images.original.url;

async function fetchMorningGif(searchQuery = "good morning") {
  return fetch(
    `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_API_KEY}&q=${searchQuery}`
  )
    .then((res) => res.json())
    .then((json) => {
      const random = Math.floor(Math.random() * json.data.length);

      return json.data[random].images.original.url;
    });
}

const app = new App({
  token: process.env.SLACK_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  logLevel: LogLevel.DEBUG,
});

app.command("/square", async ({ command, ack, say }) => {
  try {
    await ack();
    let txt = command.text; // The inputted parameters
    console.log({ command });
    if (isNaN(txt)) {
      say(txt + " is not a number");
    } else {
      say(txt + " squared = " + parseFloat(txt) * parseFloat(txt));
    }
  } catch (error) {
    console.log("err");
    console.error(error);
  }
});

app.message(/gm/, async ({ message, say }) => {
  const gifUrl = await fetchMorningGif();

  await say({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Good morning <@${message.user}>!\n${gifUrl}
          `,
        },
      },
    ],
    text: `Good morning <@${message.user}>!\n${gifUrl}`,
  });
});

(async () => {
  const port = 3000;

  await app.start(process.env.PORT || port);
  console.log(`🔥 Slack Bolt app is running on port ${port}! 🔥`);
})();

app.client.chat.scheduleMessage({
  token: process.env.SLACK_TOKEN,
  channel: "general",
  text: "Good morning! ☀️\n" + getRandomGif(),
  post_at: now() + 15,
});

// function isWeekend(date = new Date()) {
//   return date.getDay() === 5 || date.getDay() === 6;
// }

// // Check if it's not the weekend and that is it 10:00 AM
// if (!isWeekend() && new Date().getHours() === 10) {
//   app.client.chat.scheduleMessage({
//     token: process.env.SLACK_TOKEN,
//     channel: "general",
//     text: "Good morning! ☀️\n" + getRandomGif(),
//     post_at: now() + 15,
//   });
// }
