import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

// Channel Access Token
const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;

// Flex message (ใช้ส่งเมื่อผู้ใช้กดปุ่มใน Rich Menu)
const flexMessage = {
  type: "flex",
  altText: "Contact",
  contents: {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "ติดต่อสอบถาม",
          weight: "bold",
          size: "xl",
          align: "center"
        },
        {
          type: "text",
          text: "โปรดพิมพ์คำถามของคุณ หรือกดปุ่มด้านล่างเพื่อทักแอดมิน",
          wrap: true,
          margin: "md",
          size: "sm",
          color: "#666666",
          align: "center"
        }
      ]
    },
    footer: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "button",
          style: "primary",
          color: "#FF3366",
          action: {
            type: "uri",
            label: "ทักแอดมิน",
            uri: "https://line.me/R/ti/p/~YOUR_LINE_ID"
          }
        }
      ]
    }
  }
};

// Webhook endpoint
app.post("/webhook", async (req, res) => {
  const events = req.body.events;

  if (!events || events.length === 0) {
    return res.send("OK");
  }

  for (const event of events) {
    if (event.type === "message" && event.message.text === "ติดต่อสอบถาม") {
      await replyFlex(event.replyToken);
    }
  }

  return res.send("OK");
});

// Reply Flex Message
async function replyFlex(replyToken) {
  const url = "https://api.line.me/v2/bot/message/reply";

  const payload = {
    replyToken,
    messages: [flexMessage]
  };

  await axios.post(url, payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`
    }
  });
}

app.listen(3000, () => console.log("Server is running on port 3000"));
