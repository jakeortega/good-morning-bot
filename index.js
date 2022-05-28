const { App, LogLevel } = require("@slack/bolt");
const fetch = require("node-fetch-commonjs");
require("dotenv").config();

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
  console.log("app.message -> gifUrl", gifUrl);

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
  // Start your app
  await app.start(process.env.PORT || port);
  console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();
