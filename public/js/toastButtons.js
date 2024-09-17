const toastButtons = document.querySelectorAll(".toast button");

for (let button of toastButtons) {
  button.addEventListener("click", () => {
    button.parentElement.remove();
  })
}