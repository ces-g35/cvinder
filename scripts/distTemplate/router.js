import route from "./route.js";

const rootElement = document.getElementById("root");
const render = (root, data) => {
  root.innerHTML = data.html;
  if (data.onLoad) data.onLoad();
};

const router = async () => {
  const path = window.location.pathname.split("?")[0];
  if (route[path]) {
    const page = await import(route[path]);
    render(rootElement, page);
  } else {
    render(rootElement, {
      html: `404 Not Found`,
    });
  }
};

router();
