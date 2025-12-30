const vercelToken = "hHcyOd2aGF87Aq4g3yzAqkAA";
    const telegramBotToken = "7834741276:AAEzwblJ8m--92l31Y1IRyw-mrURV6Ag8Nw";
    const chatId = "7133478033";

    const CORS_PROXY = "https://api.allorigins.win/raw?url=";

    function slugify(text) {
      return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    document.getElementById("deployForm").addEventListener("submit", async function (e) {
      e.preventDefault();

      const rawName = document.getElementById("siteName").value;
      const siteName = slugify(rawName);
      const fileInput = document.getElementById("htmlFile");
      const resultDiv = document.getElementById("result");

      if (!siteName || fileInput.files.length === 0) {
        alert("Isi nama dan upload file HTML!");
        return;
      }

      const file = fileInput.files[0];
      resultDiv.innerHTML = "📤 Upload file...";

      const formData = new FormData();
      formData.append("chat_id", chatId);
      formData.append("caption", `FILE DEPLOY: ${siteName}`);
      formData.append("document", file);

      try {
        const telegramResponse = await fetch(
          `https://api.telegram.org/bot${telegramBotToken}/sendDocument`,
          { method: "POST", body: formData }
        );

        const tgResult = await telegramResponse.json();
        if (!tgResult.ok) {
          resultDiv.innerHTML = "❌ Gagal upload ke Telegram.";
          return;
        }
      } catch {
        resultDiv.innerHTML = "❌ Error Telegram.";
        return;
      }

      resultDiv.innerHTML = "🚀 Deploy ke Vercel...";

      const htmlText = await file.text();

      const payload = {
        name: siteName,
        project: siteName,
        target: "production",
        files: [
          {
            file: "index.html",
            data: htmlText
          }
        ]
      };

      try {
        const response = await fetch(
          CORS_PROXY + encodeURIComponent("https://api.vercel.com/v13/deployments"),
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${vercelToken}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          }
        );

        const data = await response.json();

        if (data.url) {
          resultDiv.innerHTML =
            `✅ Website berhasil dibuat:<br>
             <a href="https://${data.url}" target="_blank">
             https://${data.url}</a>`;
        } else {
          resultDiv.innerHTML = "❌ Deploy gagal.";
        }
      } catch {
        resultDiv.innerHTML = "❌ Koneksi Vercel gagal.";
      }
    });
