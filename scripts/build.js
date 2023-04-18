import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const hotReloadScript = `
<script>
// Dev injected script

const devServer = new WebSocket("ws://localhost:4000");

devServer.onmessage = (event) => {
  const { message } = JSON.parse(event.data);
  if (message === "RELOAD") {
    window.location.reload();
  }
};
</script>
`;

function* walkSync(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory()) {
      yield* walkSync(path.join(dir, file.name));
    } else {
      yield path.join(dir, file.name);
    }
  }
}

const viewPath = path.join(__dirname, "../src/view");
const distPath = path.join(__dirname, "../dist");
const pagePath = path.join(viewPath, "pages");
const distPagePath = path.join(distPath, "pages");

const generatePage = (scriptContent, htmlContent) => `
export const html = \`${htmlContent.trim()}\`;
export const pageDidMount = (...param) => \`${scriptContent.trim()}\`;
`;

export const buildDev = () => {
  fs.rmSync(distPath, { recursive: true, force: true });
  fs.mkdirSync(distPath);
  fs.cpSync(path.join(__dirname, "./distTemplate"), distPath, {
    recursive: true,
  });

  // copy scripts and style
  fs.cpSync(path.join(viewPath, "scripts"), path.join(distPath, "scripts"), {
    recursive: true,
  });
  fs.cpSync(path.join(viewPath, "styles"), path.join(distPath, "styles"), {
    recursive: true,
  });

  fs.mkdirSync(distPagePath);

  const route = {};

  for (const filePath of walkSync(pagePath)) {
    const routeName = filePath.replace(pagePath, "").replace(".html", "");
    const matchRouteName = [];
    matchRouteName.push(filePath.replace(pagePath, "").replace(".html", ""));
    if (routeName.endsWith("/index")) {
      matchRouteName.push(routeName.replace("/index", "/"));
      matchRouteName.push(routeName.replace("/index", ""));
    }

    let pageName = filePath
      .replace(pagePath, "")
      .replace(".html", "")
      .replace(/\//g, "_");
    if (pageName.startsWith("_")) {
      pageName = pageName.slice(1);
    }

    pageName = `${pageName}.js`;

    const matchScript = /<script>(.|\n)*?<\/script>/g;

    const htmlContent = fs.readFileSync(filePath, "utf8");
    const scriptContent = htmlContent
      .match(matchScript)[0]
      .replace(/<script>|<\/script>/g, "");

    fs.writeFileSync(
      path.join(distPagePath, pageName),
      generatePage(scriptContent, htmlContent.replace(matchScript, ""))
    );

    matchRouteName.forEach((routeName) => {
      route[routeName] = `./pages/${pageName}`;
    });
  }

  fs.writeFileSync(
    path.join(distPath, "route.js"),
    `export default ${JSON.stringify(route)};`
  );

  fs.writeFileSync(
    path.join(distPath, "index.html"),
    fs
      .readFileSync(path.join(distPath, "index.html"), "utf8")
      .replace("</html>", `${hotReloadScript}</html>`)
  );
};
