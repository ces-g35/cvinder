import route from "./route.js";

class Node {
  constructor() {
    this.nodes = {};
    this.filePath = null;
    this.default = null;
  }

  addDir(route) {
    this.nodes[route] = new Node();
  }

  addDefault() {
    this.default = new Node();
  }

  setFile(filePath) {
    this.filePath = filePath;
  }

  match(route) {
    return this._match(route.split(/[\/_]/g));
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
      return this.default._match(routes);
    }
    return null;
  }
}

function createTree(obj) {
  const root = new Node();
  root.nodes[""] = new Node();

  Object.entries(obj).forEach(([key, value]) => {
    const routes = key.split(/[\/_]/g);
    createBranch(root, routes, value);
  });

  return root;
}

function createBranch(node, routes, filePath) {
  let current = node;

  let isIndex = false;

  routes.forEach((route, idx) => {
    const dynamic = /^\[.*\](?:.js)?$/.test(route);

    if (dynamic) {
      if (current.default == null) {
        current.addDefault();
      }
      current = current.default;
    } else if (route == "index" && idx == routes.length - 1) {
      // before careful about name collision for example.
      // /pages
      //  /about.html
      //  /about
      //    index.html
      current.setFile(filePath);
      isIndex = true;
    } else {
      if (!(route in current.nodes)) {
        current.addDir(route);
      }
      current = current.nodes[route];
    }
  });
  if (!isIndex) {
    current.setFile(filePath);
  }
}

/**
 *
 * @param {Node} tree
 * @param {number} indentLevel
 */
function showTree(tree, indentLevel = 0) {
  function print(msg) {
    console.log("  ".repeat(indentLevel) + msg);
  }

  Object.entries(tree.nodes).forEach(([k, v]) => {
    let content = k;
    if (v.filePath) {
      content += ": " + v.filePath;
    }
    print(content);
    showTree(v, indentLevel + 1);
  });

  if (tree.default) {
    let content = "[wildcard]";
    if (tree.default.filePath) {
      content += ": " + tree.default.filePath;
    }
    print(content);
    showTree(tree.default, indentLevel + 1);
  }
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
  // For consistancy
  // url:3000 location should be "" instead of "/"
  const location = window.location.pathname.split("?")[0];
  const path = location == "/" ? "" : location;
  window.globalTree = createTree(route);
  const filePath = window.globalTree.match(path);
  // for debuging
  showTree(window.globalTree);

  if (filePath) {
    const page = await import(filePath);
    render(rootElement, page);
  } else {
    render(rootElement, {
      html: `404 Not Found`,
    });
  }
};

pathRouter();
