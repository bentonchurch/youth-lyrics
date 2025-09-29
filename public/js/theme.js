function setTheme(theme) {
  document.body.setAttribute("data-bs-theme", theme);
  localStorage.setItem("color-theme", theme);

  // Change all color icons (for button toggles and stuff)
  document.querySelectorAll(".color-theme-icon").forEach(e => {
    e.classList.remove("bi-sun", "bi-moon");
    e.classList.add(theme === "light" ? "bi-moon" : "bi-sun");
  });
}

function toggleTheme() {
  setTheme(localStorage.getItem("color-theme") === 'dark' ? 'light' : 'dark');
}

if (!localStorage.getItem("color-theme")) {
  setTheme("light");
} else {
  setTheme(localStorage.getItem("color-theme"));
}
