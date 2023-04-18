const rootElement = document.getElementById("root");
const render = (root, data) => {
  root.innerHTML = data.html;
  if (data.onLoad) data.onLoad();
};

const router = async () => {
  const path = window.location.pathname;
  if (path.startsWith("/interests")) {
    const interests = await import("./components/interests.js");
    render(rootElement, interests.default);
  } else if (path.startsWith("/add-photos")) {
    const photodefault = await import("./components/photo.js");
    render(rootElement, photodefault);
  } else if (path.startsWith("/")) {
    const index = await import("./components/index.js");
    render(rootElement, index.default);
  } else {
    const error404 = await import("./components/404.js");
    render(rootElement, error404.default);
  }
};

router();
