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
    console.log("🔥 WEBHOOK HIT");

    const events = req.body.events;

    if (!events || events.length === 0) {
      return res.sendStatus(200);
    }

   await Promise.all(events.map(async (event) => {

  console.log("========== NEW EVENT ==========");
  console.log("📦 EVENT TYPE:", event.type);
  console.log("📦 MESSAGE TYPE:", event.message?.type);
  console.log("📩 TEXT:", event.message?.text);
  console.log("🎯 FULL EVENT:", JSON.stringify(event, null, 2));

  if (event.type === "message" && event.message.type === "text") {
    const text = event.message.text;

    if (text === "ติดต่อสอบถาม") {
      console.log("🚀 CALL FLEX");
      await replyFlex(event.replyToken);
    }
  }

if (event.type === "message" && event.message?.type === "sticker") {

  console.log("✨ USER SENT STICKER:", event.message);

  const { packageId, stickerId } = event.message;

  console.log("📦 PACKAGE:", packageId);
  console.log("🎯 STICKER:", stickerId);

  let replyText = "ระบบกำลังช่วยดูแลข้อความของคุณอยู่ หากต้องการข้อมูลเพิ่มเติม แจ้งได้เลยนะคะ☺️";

  // 👋 สติ๊กเกอร์ทักทาย
  if (packageId === "446" && stickerId === "1988") {
    replyText = "ยินดีให้บริการค่ะ หากต้องการสอบถามข้อมูลการผ่อนสินค้า สามารถแจ้งได้เลยนะคะ💖";
  }

  // 🙏 สติ๊กเกอร์ขอบคุณ
  else if (packageId === "446" && stickerId === "1991") {
    replyText = "ขอบคุณค่ะ ยินดีให้บริการเสมอนะคะ🥰";
  }

  // 🟡 อื่นๆ
  else {
    replyText = "ระบบกำลังช่วยดูแลข้อความของคุณอยู่ หากต้องการข้อมูลเพิ่มเติม แจ้งได้เลยนะคะ☺️";
  }

  await axios.post(
    "https://api.line.me/v2/bot/message/reply",
    {
      replyToken: event.replyToken,
      messages: [
        {
          type: "text",
          text: replyText
        }
      ]
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`
      }
    }
  );
}

}));

    res.sendStatus(200);

  } catch (err) {
    console.error("❌ Webhook Error:", err);
    res.sendStatus(200);
  }
});

// =======================
// FLEX REPLY FUNCTION
// =======================
async function replyFlex(replyToken) {
  try {
    console.log("📤 SENDING FLEX");

    const flexMessage = {
      "type": "flex",
      "altText": "เมนูบริการและติดต่อเรา",
      "contents": {
        "type": "carousel",
        "contents": [
          {
            "type": "bubble",
            "size": "mega",
            "hero": {
              "type": "image",
              "url": "https://cdn.phototourl.com/free/2026-05-18-50faf8b4-b248-4d18-a303-f3bdb9bc55e3.png",
              "size": "full",
              "aspectRatio": "20:13",
              "aspectMode": "cover"
            },
            "body": {
              "type": "box",
              "layout": "vertical",
              "paddingAll": "xl",
              "contents": [
                {
                  "type": "text",
                  "text": "สั่งซื้อ/ผ่อนมือถือ",
                  "weight": "bold",
                  "size": "xl",
                  "color": "#1F2937"
                },
                {
                  "type": "text",
                  "text": "รุ่นเด่นราคาดี ผ่อนสบาย นานสูงสุด 36 เดือน",
                  "size": "xs",
                  "color": "#9CA3AF",
                  "margin": "sm"
                },
                {
                  "type": "box",
                  "layout": "vertical",
                  "margin": "lg",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "button",
                      "action": { "type": "message", "label": "สนใจผ่อนต้องทำยังไง", "text": "สนใจผ่อนต้องทำยังไง" },
                      "style": "primary", "color": "#E11212", "height": "sm"
                    },
                    {
                      "type": "button",
                      "action": { "type": "message", "label": "สมัครออนไลน์ หรือ ไปที่ร้าน", "text": "ออนไลน์ / ไปที่ร้าน" },
                      "style": "primary", "color": "#FF5757", "height": "sm"
                    },
                    {
                      "type": "button",
                      "action": { "type": "message", "label": "เช็คโปรโมชั่นล่าสุด", "text": "เช็คโปรโมชั่นล่าสุด" },
                      "style": "primary", "color": "#FF9191", "height": "sm"
                    }
                  ]
                }
              ]
            }
          },
          {
            "type": "bubble",
            "size": "mega",
            "hero": {
              "type": "image",
              "url": "https://cdn.phototourl.com/free/2026-05-18-7737c8fc-4b29-410a-8d61-a62b7357cea5.png",
              "size": "full",
              "aspectRatio": "20:13",
              "aspectMode": "cover"
            },
            "body": {
              "type": "box",
              "layout": "vertical",
              "paddingAll": "xl",
              "contents": [
                {
                  "type": "text",
                  "text": "รายละเอียดสินค้า",
                  "weight": "bold",
                  "size": "xl",
                  "color": "#1F2937"
                },
                {
                  "type": "text",
                  "text": "รวมมือถือรุ่นฮิต กล้องสวย สเปกแรงไว้ที่นี่",
                  "size": "xs",
                  "color": "#9CA3AF",
                  "margin": "sm"
                },
                {
                  "type": "box",
                  "layout": "vertical",
                  "margin": "lg",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "button",
                      "action": { "type": "message", "label": "มีประกันร้านไหม", "text": "มีประกันร้านไหม" },
                      "style": "primary", "color": "#E11212", "height": "sm"
                    },
                    {
                      "type": "button",
                      "action": { "type": "message", "label": "เครื่องมือ 1 หรือ มือ 2", "text": "เครื่องมือ 1 หรือ มือ 2" },
                      "style": "primary", "color": "#FF5757", "height": "sm"
                    },
                    {
                      "type": "button",
                      "action": { "type": "message", "label": "รับเทิร์นเครื่องเก่าไหม", "text": "รับเทิร์นเครื่องเก่าไหม" },
                      "style": "primary", "color": "#FF9191", "height": "sm"
                    }
                  ]
                }
              ]
            }
          },
          {
            "type": "bubble",
            "size": "mega",
            "hero": {
              "type": "image",
              "url": "https://cdn.phototourl.com/free/2026-05-18-eeb69b97-01f5-4e7b-8671-2e9546adc628.png",
              "size": "full",
              "aspectRatio": "20:13",
              "aspectMode": "cover"
            },
            "body": {
              "type": "box",
              "layout": "vertical",
              "paddingAll": "xl",
              "contents": [
                {
                  "type": "text",
                  "text": "บริการหลังการขาย",
                  "weight": "bold",
                  "size": "xl",
                  "color": "#1F2937"
                },
                {
                  "type": "text",
                  "text": "แจ้งปัญหาการใช้ แจ้งเคลม ติดตามการซ่อม",
                  "size": "xs",
                  "color": "#9CA3AF",
                  "margin": "sm"
                },
                {
                  "type": "box",
                  "layout": "vertical",
                  "margin": "lg",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "button",
                      "action": { "type": "message", "label": "ลืมรหัสล็อกหน้าจอ", "text": "ลืมรหัสล็อกหน้าจอ" },
                      "style": "primary", "color": "#E11212", "height": "sm"
                    },
                    {
                      "type": "button",
                      "action": { "type": "message", "label": "เช็คสถานะการซ่อม", "text": "เช็คสถานะการซ่อม" },
                      "style": "primary", "color": "#FF5757", "height": "sm"
                    },
                    {
                      "type": "button",
                      "action": { "type": "message", "label": "ย้ายข้อมูลเครื่องให้ไหม", "text": "ย้ายข้อมูลเครื่องให้ไหม" },
                      "style": "primary", "color": "#FF9191", "height": "sm"
                    }
                  ]
                }
              ]
            }
          },
          {
            "type": "bubble",
            "size": "mega",
            "header": {
              "type": "box",
              "layout": "vertical",
              "paddingAll": "xxl",
              "background": {
                "type": "linearGradient",
                "angle": "135deg",
                "startColor": "#E11212",
                "endColor": "#FF5757"
              },
              "contents": [
                {
                  "type": "box",
                  "layout": "horizontal",
                  "alignItems": "center",
                  "contents": [
                    {
                      "type": "box",
                      "layout": "vertical",
                      "flex": 4,
                      "contents": [
                        { "type": "text", "text": "C O N T A C T S", "color": "#FFFFFFB3", "weight": "bold", "size": "xxs" },
                        { "type": "text", "text": "ติดต่อเรา", "color": "#FFFFFF", "size": "xxl", "weight": "bold", "margin": "xs" }
                      ]
                    },
                    {
                      "type": "box",
                      "layout": "vertical",
                      "flex": 1,
                      "width": "45px",
                      "contents": [
                        { "type": "image", "url": "https://api.at-once.info/storage/app/public/posts/1659500072_62e9ec286f059.png", "size": "full", "aspectMode": "fit" }
                      ]
                    }
                  ]
                }
              ]
            },
            "body": {
              "type": "box",
              "layout": "vertical",
              "paddingAll": "lg",
              "backgroundColor": "#F9FAFB",
              "contents": [
                { "type": "text", "text": "คลิกเพื่อโทรติดต่อเจ้าหน้าที่", "size": "xs", "color": "#9CA3AF", "weight": "regular" },
                {
                  "type": "box",
                  "layout": "vertical",
                  "margin": "md",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "box", "layout": "horizontal", "alignItems": "center", "paddingAll": "12px", "backgroundColor": "#FFFFFF", "cornerRadius": "16px",
                      "contents": [
                        { "type": "box", "layout": "vertical", "width": "42px", "height": "42px", "cornerRadius": "21px", "backgroundColor": "#E0E7FF", "paddingAll": "6px", "contents": [{ "type": "image", "url": "https://cdn-icons-png.flaticon.com/512/3135/3135715.png", "size": "full" }] },
                        { "type": "box", "layout": "vertical", "margin": "lg", "flex": 3, "contents": [{ "type": "text", "text": "ฝ่ายแอดมิน", "size": "xs", "weight": "bold", "color": "#1F2937" }, { "type": "text", "text": "08:30 - 17:30 น.", "size": "xxs", "color": "#6B7280" }] },
                        { "type": "box", "layout": "vertical", "width": "55px", "cornerRadius": "15px", "paddingAll": "6px", "backgroundColor": "#EEF2FF", "action": { "type": "uri", "label": "โทร", "uri": "tel:000000000" }, "contents": [{ "type": "text", "text": "โทร", "color": "#6366F1", "size": "xs", "align": "center", "weight": "bold" }] }
                      ]
                    },
                    {
                      "type": "box", "layout": "horizontal", "alignItems": "center", "paddingAll": "12px", "backgroundColor": "#FFFFFF", "cornerRadius": "16px",
                      "contents": [
                        { "type": "box", "layout": "vertical", "width": "42px", "height": "42px", "cornerRadius": "21px", "backgroundColor": "#FCE7F3", "paddingAll": "6px", "contents": [{ "type": "image", "url": "https://cdn-icons-png.flaticon.com/512/3135/3135715.png", "size": "full" }] },
                        { "type": "box", "layout": "vertical", "margin": "lg", "flex": 3, "contents": [{ "type": "text", "text": "ฝ่ายวิเคราะห์สินเชื่อ", "size": "xs", "weight": "bold", "color": "#1F2937" }, { "type": "text", "text": "08:30 - 17:30 น.", "size": "xxs", "color": "#6B7280" }] },
                        { "type": "box", "layout": "vertical", "width": "55px", "cornerRadius": "15px", "paddingAll": "6px", "backgroundColor": "#FDF2F8", "action": { "type": "uri", "label": "โทร", "uri": "tel:000000000" }, "contents": [{ "type": "text", "text": "โทร", "color": "#EC4899", "size": "xs", "align": "center", "weight": "bold" }] }
                      ]
                    },
                    {
                      "type": "box", "layout": "horizontal", "alignItems": "center", "paddingAll": "12px", "backgroundColor": "#FFFFFF", "cornerRadius": "16px",
                      "contents": [
                        { "type": "box", "layout": "vertical", "width": "42px", "height": "42px", "cornerRadius": "21px", "backgroundColor": "#FFEDD5", "paddingAll": "6px", "contents": [{ "type": "image", "url": "https://cdn-icons-png.flaticon.com/512/3135/3135715.png", "size": "full" }] },
                        { "type": "box", "layout": "vertical", "margin": "lg", "flex": 3, "contents": [{ "type": "text", "text": "ฝ่าย IT Support", "size": "xs", "weight": "bold", "color": "#1F2937" }, { "type": "text", "text": "09:00 - 21:00 น.", "size": "xxs", "color": "#6B7280" }] },
                        { "type": "box", "layout": "vertical", "width": "55px", "cornerRadius": "15px", "paddingAll": "6px", "backgroundColor": "#FFF7ED", "action": { "type": "uri", "label": "โทร", "uri": "tel:000000000" }, "contents": [{ "type": "text", "text": "โทร", "color": "#F97316", "size": "xs", "align": "center", "weight": "bold" }] }
                      ]
                    },
                    {
                      "type": "box", "layout": "horizontal", "alignItems": "center", "paddingAll": "12px", "backgroundColor": "#FFFFFF", "cornerRadius": "16px",
                      "contents": [
                        { "type": "box", "layout": "vertical", "width": "42px", "height": "42px", "cornerRadius": "21px", "backgroundColor": "#DCFCE7", "paddingAll": "6px", "contents": [{ "type": "image", "url": "https://cdn-icons-png.flaticon.com/512/3135/3135715.png", "size": "full" }] },
                        { "type": "box", "layout": "vertical", "margin": "lg", "flex": 3, "contents": [{ "type": "text", "text": "ฝ่ายบุคคล", "size": "xs", "weight": "bold", "color": "#1F2937" }, { "type": "text", "text": "สมัครงาน/ติดต่ออื่นๆ", "size": "xxs", "color": "#6B7280" }] },
                        { "type": "box", "layout": "vertical", "width": "55px", "cornerRadius": "15px", "paddingAll": "6px", "backgroundColor": "#F0FDF4", "action": { "type": "uri", "label": "โทร", "uri": "tel:000000000" }, "contents": [{ "type": "text", "text": "โทร", "color": "#22C55E", "size": "xs", "align": "center", "weight": "bold" }] }
                      ]
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    };

    const res = await axios.post(
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

    console.log("✅ FLEX SENT SUCCESS");

  } catch (err) {
    console.log("❌ FLEX ERROR:");
    console.log(err.response?.data || err.message);
  }
}

// =======================
// START SERVER
// =======================
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server running on port " + port);
});
