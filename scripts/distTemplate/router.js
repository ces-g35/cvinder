import route from "./route.js";

class Node {
  constructor() {
    this.nodes = {};
    this.filePath = null;
  }

  addDir(route) {
    this.nodes[route] = new Node();
  }

  setFile(filePath) {
    this.filePath = filePath;
  }

  match(route) {
    return this._match(route.split("/"));
  }

  _match(routes) {
    if (routes.length == 0) {
      return this.filePath;
    }
    const current = routes.shift();
    if (current in this.nodes) {
      return this.nodes[current]._match(routes);
    }
    if (this.default != null) {
      return this.default.path;
    }
    return null;
  }
}

function createTree(obj) {
  const root = new Node();
  root.nodes[""] = new Node();

  Object.entries(obj).forEach(([key, value]) => {
    console.log("key", key);
    const routes = key.split("/");
    createBranch(root, routes, value);
  });

  return root;
}

/**
 *
 * @param {DirectoryNode} node
 * @param {Array<string>} routes
 * @param {string} filePath
 */
function createBranch(node, routes, filePath) {
  let current = node;
  routes.forEach((route) => {
    if (!(route in current.nodes)) {
      current.addDir(route);
    }
    current = current.nodes[route];
  });
  current.setFile(filePath);
}

const rootElement = document.getElementById("root");
const render = (root, data) => {
  root.innerHTML = data.html;
  if (data.pageDidMount) data.pageDidMount();
};

const router = {
  push: (path) => {
    window.history.pushState(null, null, path);
    pathRouter();
  },
  pop: () => {
    window.history.back();
    pathRouter();
  },
};

window.router = router;

const pathRouter = async () => {
  const path = window.location.pathname.split("?")[0];
  window.globalTree = createTree(route);
  if (window.globalTree.match(path)) {
    const page = await import(route[path]);
    render(rootElement, page);
  } else {
    render(rootElement, {
      html: `404 Not Found`,
    });
  }
};

pathRouter();
