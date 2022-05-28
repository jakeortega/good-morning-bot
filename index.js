const { App } = require("@slack/bolt");
require("dotenv").config();

const app = new App({
  token: process.env.SLACK_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
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

(async () => {
  const port = 3000;
  // Start your app
  await app.start(process.env.PORT || port);
  console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();
