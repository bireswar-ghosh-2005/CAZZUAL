document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("projectForm");
  const submitBtn = document.getElementById("submitBtn");
  const message = document.getElementById("formMessage");

  const stickerBtn = document.getElementById("stickerBtn");
  const stickersInput = document.getElementById("stickersInput");

  // Load stickers (if any)
  const selectedStickers = JSON.parse(
    localStorage.getItem("selectedStickers") || "[]"
  );

  if (selectedStickers.length > 0) {
    stickerBtn.innerText = "🎁 Stickers: " + selectedStickers.join(", ");
    stickersInput.value = selectedStickers.join(",");
  }

  // Sticker button click
  stickerBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "sticker.html";
  });

  // Submit handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.innerText = "⏳ Please wait...";
    message.innerText = "Submitting project...";
    message.className = "form-message loading";

    try {
      const res = await fetch(
        "https://project-backend-hybc.onrender.com/api/projects",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            title: document.getElementById("title").value,
            type: document.getElementById("type").value,
            description: document.getElementById("description").value,
            deadline: document.getElementById("deadline").value,
            stickers: selectedStickers
          })
        }
      );

      if (!res.ok) throw new Error("Failed");

      message.innerText = "✅ Project submitted successfully!";
      message.className = "form-message success";

      form.reset();
      localStorage.removeItem("selectedStickers");

      setTimeout(() => {
        message.innerText = "";
        submitBtn.disabled = false;
        submitBtn.innerText = "Submit Project";
        stickerBtn.innerText = "🎁 Select Stickers (Optional)";
      }, 2000);

    } catch (err) {
      message.innerText = "❌ Something went wrong. Try again.";
      submitBtn.disabled = false;
      submitBtn.innerText = "Submit Project";
    }
  });

});
