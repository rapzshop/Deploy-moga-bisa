import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const upload = multer();
app.use(cors());

const VERCEL_TOKEN = "ISI_TOKEN_VERCEL_KAMU_DI_SINI";

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
}

app.post("/deploy", upload.single("file"), async (req, res) => {
  try {
    const siteName = slugify(req.body.siteName);
    const html = req.file.buffer.toString();

    const payload = {
      name: siteName,
      project: siteName,
      target: "production",
      files: [
        { file: "index.html", data: html }
      ]
    };

    const r = await fetch("https://api.vercel.com/v13/deployments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await r.json();

    if (!data.url) {
      return res.status(400).json({ success: false, data });
    }

    res.json({
      success: true,
      url: "https://" + data.url
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(3000, () => {
  console.log("✅ Backend aktif di http://localhost:3000");
});
