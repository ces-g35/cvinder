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

const viewPath = path.join(__dirname, "../src/view");
const distPath = path.join(__dirname, "../dist");
const pagePath = path.join(viewPath, "pages");
const distPagePath = path.join(distPath, "pages");

const generatePage = (scriptContent, htmlContent, layout) => {
  if (layout) {
    htmlContent = layout.replace("<slot></slot>", htmlContent);
  }

  return `export const html = \`${htmlContent.trim()}\`; export const pageDidMount = (...param) => {${scriptContent.trim()}};`;
};

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

const route = {};

const getLayout = (filePath) => {
  const layoutPath = path.join(filePath, "__layout.html");
  if (fs.existsSync(layoutPath)) {
    return fs.readFileSync(layoutPath, "utf8");
  }
  return null;
};

const nestLayout = (layouts) => {
  let result = "<slot></slot>";
  for (const layout of layouts.reverse()) {
    if (layout) {
      result = layout.replace("<slot></slot>", result);
    }
  }
  return result;
};

function walkAndGenerate(dir, parent = [dir]) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      walkAndGenerate(filePath, [...parent, filePath]);
    } else {
      if (file.name == "__layout.html") {
        continue;
      }

      const currentLayout = nestLayout(parent.map((p) => getLayout(p)));
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
        .replace(/[\/\\]/g, "_");

      if (pageName.startsWith("_")) {
        pageName = pageName.slice(1);
      }

      pageName = `${pageName}.js`;

      const matchScript = /<script>(.|\n|\r\n)*?<\/script>/g;

      const htmlContent = fs.readFileSync(filePath, "utf8");
      const scriptContent = htmlContent
        .match(matchScript)[0]
        .replace(/<script>|<\/script>/g, "");

      fs.writeFileSync(
        path.join(distPagePath, pageName),
        generatePage(
          scriptContent,
          htmlContent.replace(matchScript, ""),
          currentLayout
        )
      );

      matchRouteName.forEach((routeName) => {
        const formattedRouteName = routeName.replaceAll("\\", "/");
        route[formattedRouteName] = "./pages/" + pageName;
      });
    }
  }
}

export const buildDev = ({ debug }) => {
  fs.rmSync(distPath, { recursive: true, force: true });
  fs.mkdirSync(distPath);
  fs.cpSync(path.join(__dirname, "./distTemplate"), distPath, {
    recursive: true,
  });

  fs.cpSync(path.join(__dirname, "../public"), distPath, {
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

  walkAndGenerate(pagePath);

  fs.writeFileSync(
    path.join(distPath, "route.js"),
    `export default ${JSON.stringify(route)};`
  );

  let fileContent = fs.readFileSync(path.join(distPath, "index.html"), "utf8");

  if (debug) {
    fileContent = fileContent.replace("</html>", `${hotReloadScript}</html>`);
  }

  fs.writeFileSync(path.join(distPath, "index.html"), fileContent);
};
