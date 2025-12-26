const stickers = document.querySelectorAll(".sticker");
const goBackBtn = document.getElementById("goBack");

let selected = [];

stickers.forEach(sticker => {
  sticker.addEventListener("click", () => {
    const code = sticker.dataset.code;

    if (sticker.classList.contains("selected")) {
      sticker.classList.remove("selected");
      selected = selected.filter(s => s !== code);
    } else {
      if (selected.length >= 4) {
        alert("You can select only 4 stickers");
        return;
      }
      sticker.classList.add("selected");
      selected.push(code);
    }
  });
});

goBackBtn.addEventListener("click", () => {
  if (selected.length !== 4 && selected.length !== 0) {
    alert("Please select exactly 4 stickers or none");
    return;
  }

  localStorage.setItem("selectedStickers", JSON.stringify(selected));
  window.location.href = "index.html";
});
