import error404 from "./components/404.js";
import index from "./components/index.js";
import interests from "./components/interests.js";
import photo from "./components/photo.js";

const rootElement = document.getElementById("root");
const render = (root, data) => {
  root.innerHTML = data.html;
  if (data.onLoad) data.onLoad();
};

switch (window.location.pathname) {
  case "/":
    render(rootElement, index);
    break;
  case "/interests":
    render(rootElement, interests);
    break;
  case "/add-photos":
    render(rootElement, photo);
    break;
  default:
    render(rootElement, error404);
    break;
}
