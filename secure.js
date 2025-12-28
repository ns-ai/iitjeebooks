(function () {
  const KEY = 23;

  function encrypt(str) {
    return btoa(
      str.split("").map(c =>
        String.fromCharCode(c.charCodeAt(0) ^ KEY)
      ).join("")
    );
  }

  function decrypt(str) {
    return atob(str).split("").map(c =>
      String.fromCharCode(c.charCodeAt(0) ^ KEY)
    ).join("");
  }

  // Handle encrypted URL directly entered
  const token = location.pathname.slice(1);
  if (token && !token.includes(".") && !token.includes("/")) {
    try {
      const realPath = decrypt(token);
      if (realPath.startsWith("/")) {
        location.replace(realPath);
      }
    } catch (e) {}
  }

  // Intercept all internal link clicks
  document.addEventListener("click", function (e) {
    const a = e.target.closest("a");
    if (!a) return;

    const href = a.getAttribute("href");
    if (!href || href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:")) return;

    e.preventDefault();
    const realPath = new URL(href, location.origin).pathname;
    const encrypted = encrypt(realPath);
    history.pushState({}, "", "/" + encrypted);
    location.href = realPath;
  });
})();
