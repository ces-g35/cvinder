const rootElement = document.getElementById("root");
const render = (root, data) => {
  root.innerHTML = data.html;
  if (data.onLoad) data.onLoad();
};

const router = async () => {
  switch (window.location.pathname) {
    case "/":
      const index = await import("./components/index.js");
      render(rootElement, index.default);
      break;
    case "/interests":
      const interests = await import("./components/interests.js");
      render(rootElement, interests.default);
      break;
    case "/add-photos":
      const photodefault = await import("./components/photo.js");
      render(rootElement, photodefault);
      break;
    default:
      const error404 = await import("./components/404.js");
      render(rootElement, error404.default);
      break;
  }
};

router();
