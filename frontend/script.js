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


// Restore form data if returning from sticker page
const savedFormData = JSON.parse(
  localStorage.getItem("projectFormData") || "null"
);

if (savedFormData) {
  document.getElementById("name").value = savedFormData.name || "";
  document.getElementById("email").value = savedFormData.email || "";
  document.getElementById("title").value = savedFormData.title || "";
  document.getElementById("type").value = savedFormData.type || "";
  document.getElementById("description").value = savedFormData.description || "";
  document.getElementById("deadline").value = savedFormData.deadline || "";
}



  // Sticker button click
stickerBtn.addEventListener("click", (e) => {
  e.preventDefault();

  // Save current form data before leaving
  const formData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    title: document.getElementById("title").value,
    type: document.getElementById("type").value,
    description: document.getElementById("description").value,
    deadline: document.getElementById("deadline").value
  };

  localStorage.setItem("projectFormData", JSON.stringify(formData));

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
	localStorage.removeItem("projectFormData");

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
