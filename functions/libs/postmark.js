const { ServerClient } = require("postmark");
const POSTMARK_API_TOKEN =
  process.env.POSTMARK_SERVER_API_TOKEN ||
  "4fe7f717-1fb7-43db-83c7-f6502f483245";

console.log(POSTMARK_API_TOKEN);

const client = new ServerClient(POSTMARK_API_TOKEN);

const sendEmail = async ({ from, to, subject, text }) => {
  try {
    await client.sendEmail({
      From: from,
      To: to,
      Subject: subject,
      TextBody: text,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  sendEmail,
};
