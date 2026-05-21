import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.json());

// =======================
// TEST ROUTE
// =======================
app.get("/", (req, res) => {
  res.send("LINE Bot is running ✔");
});

// =======================
// WEBHOOK
// =======================
app.post("/webhook", async (req, res) => {
  try {
    const events = req.body.events;
    if (!events || events.length === 0) return res.sendStatus(200);

    await Promise.all(events.map(async (event) => {

      if (event.type === "message" && event.message?.type === "text") {
        const text = event.message.text;

        if (text === "ติดต่อสอบถาม") {
          await replyFlex(event.replyToken);
        }

        if (text === "เช็คโปรโมชั่นล่าสุด") {
          await replyText(event.replyToken, "โปรโมชั่นล่าสุดกำลังอัปเดตนะคะ 🔥");
        }
      }

      if (event.type === "message" && event.message?.type === "sticker") {
        await replyText(event.replyToken, "ขอบคุณสำหรับสติ๊กเกอร์นะคะ 😊");
      }

    }));

    res.sendStatus(200);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.sendStatus(200);
  }
});

// =======================
// FLEX MESSAGE
// =======================
async function replyFlex(replyToken) {
  try {

    const flexMessage = {
      type: "flex",
      altText: "เมนูบริการและติดต่อเรา",
      contents: {
        type: "carousel",
        contents: [

          card(
            "สั่งซื้อ / ผ่อนมือถือ",
            "ผ่อนสบายสูงสุด 36 เดือน",
            "https://cdn.phototourl.com/free/2026-05-18-50faf8b4-b248-4d18-a303-f3bdb9bc55e3.png",
            [
              btn("สนใจผ่อนต้องทำยังไง"),
              btn("สมัครออนไลน์ / ไปที่ร้าน"),
              btn("เช็คโปรโมชั่นล่าสุด")
            ]
          ),

          card(
            "รายละเอียดสินค้า",
            "มือถือรุ่นฮิต กล้องสวย สเปกแรง",
            "https://cdn.phototourl.com/free/2026-05-18-7737c8fc-4b29-410a-8d61-a62b7357cea5.png",
            [
              btn("มีประกันร้านไหม"),
              btn("เครื่องมือ 1 / มือ 2"),
              btn("รับเทิร์นเครื่องเก่าไหม")
            ]
          ),

          card(
            "บริการหลังการขาย",
            "แจ้งปัญหา เคลม ติดตามงานซ่อม",
            "https://cdn.phototourl.com/free/2026-05-18-eeb69b97-01f5-4e7b-8671-2e9546adc628.png",
            [
              btn("ลืมรหัสล็อกหน้าจอ"),
              btn("เช็คสถานะการซ่อม"),
              btn("ย้ายข้อมูลเครื่อง")
            ]
          ),

          contactCard()

        ]
      }
    };

    await axios.post(
      "https://api.line.me/v2/bot/message/reply",
      {
        replyToken,
        messages: [flexMessage]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`
        }
      }
    );

    console.log("✅ FLEX SENT");

  } catch (err) {
    console.log("❌ FLEX ERROR:", err.response?.data || err.message);
  }
}

// =======================
// COMPONENTS (SAFE LINE FLEX)
// =======================

function card(title, desc, img, buttons) {
  return {
    type: "bubble",
    size: "mega",
    hero: {
      type: "image",
      url: img,
      size: "full",
      aspectRatio: "20:13",
      aspectMode: "cover"
    },
    body: {
      type: "box",
      layout: "vertical",
      paddingAll: "lg",
      contents: [
        {
          type: "text",
          text: title,
          weight: "bold",
          size: "lg",
          color: "#111827"
        },
        {
          type: "text",
          text: desc,
          size: "xs",
          color: "#6B7280",
          margin: "sm",
          wrap: true
        },
        {
          type: "box",
          layout: "vertical",
          margin: "md",
          spacing: "sm",
          contents: buttons
        }
      ]
    }
  };
}

function btn(text) {
  return {
    type: "button",
    style: "primary",
    color: "#E11D48",
    height: "sm",
    action: {
      type: "message",
      label: text.slice(0, 20),
      text: text
    }
  };
}

function contactCard() {
  return {
    type: "bubble",
    size: "mega",
    header: {
      type: "box",
      layout: "vertical",
      backgroundColor: "#E11D48",
      paddingAll: "20px",
      contents: [
        {
          type: "text",
          text: "CONTACT US",
          color: "#FFFFFF",
          weight: "bold",
          size: "xl"
        }
      ]
    },
    body: {
      type: "box",
      layout: "vertical",
      paddingAll: "lg",
      backgroundColor: "#F3F4F6",
      contents: [
        contactRow("แอดมิน", "08:30 - 17:30", "tel:+66812345678"),
        contactRow("สินเชื่อ", "08:30 - 17:30", "tel:+66812345678"),
        contactRow("IT Support", "09:00 - 21:00", "tel:+66812345678"),
        contactRow("HR", "สมัครงาน", "tel:+66812345678"),

        {
          type: "button",
          style: "primary",
          color: "#22C55E",
          action: {
            type: "uri",
            label: "โทรทั้งหมด",
            uri: "tel:+66812345678"
          },
          margin: "lg"
        }
      ]
    }
  };
}

function contactRow(title, sub, tel) {
  return {
    type: "box",
    layout: "horizontal",
    paddingAll: "12px",
    backgroundColor: "#FFFFFF",
    margin: "sm",
    contents: [
      {
        type: "text",
        text: title,
        size: "sm",
        weight: "bold",
        flex: 3,
        color: "#111827"
      },
      {
        type: "text",
        text: sub,
        size: "xs",
        color: "#6B7280",
        flex: 3
      },
      {
        type: "button",
        style: "primary",
        height: "sm",
        color: "#E11D48",
        action: {
          type: "uri",
          label: "โทร",
          uri: tel
        },
        flex: 2
      }
    ]
  };
}

// =======================
// TEXT REPLY
// =======================
async function replyText(replyToken, text) {
  await axios.post(
    "https://api.line.me/v2/bot/message/reply",
    {
      replyToken,
      messages: [{ type: "text", text }]
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`
      }
    }
  );
}

// =======================
// START SERVER
// =======================
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server running on port " + port);
});
