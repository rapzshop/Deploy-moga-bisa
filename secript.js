const BACKEND_URL = "http://localhost:3000/deploy"; 
    // nanti kalau backend sudah online → ganti ke URL hosting

    document.getElementById("deployForm").addEventListener("submit", async (e) => {
      e.preventDefault();

      const siteName = document.getElementById("siteName").value;
      const file = document.getElementById("htmlFile").files[0];
      const result = document.getElementById("result");

      if (!siteName || !file) {
        alert("Lengkapi data!");
        return;
      }

      result.innerHTML = "⏳ Deploying...";

      const fd = new FormData();
      fd.append("siteName", siteName);
      fd.append("file", file);

      try {
        const res = await fetch(BACKEND_URL, {
          method: "POST",
          body: fd
        });

        const data = await res.json();

        if (data.success) {
          result.innerHTML = `✅ Berhasil:<br>
          <a href="${data.url}" target="_blank">${data.url}</a>`;
        } else {
          result.innerHTML = "❌ Deploy gagal";
        }
      } catch (e) {
        result.innerHTML = "❌ Backend tidak terhubung";
      }
    });
