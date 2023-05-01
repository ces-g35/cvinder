const COOKIE_TTL = 1209600;

window.useGuard = (isSet = false) => {
  return new Promise((resolve, reject) => {
    const IS_LOGGEDIN = localStorage.getItem("CVINDER_IS_LOGGEDIN");
    if (IS_LOGGEDIN && !isSet) {
      const { expiresAt } = JSON.parse(IS_LOGGEDIN);
      if (expiresAt < Date.now()) {
        localStorage.removeItem("CVINDER_IS_LOGGEDIN");
        window.location.href = "/";
        return;
      }
    }
    fetch("/api/user/me").then((res) => {
      if (res.status !== 401) {
        localStorage.setItem(
          "CVINDER_IS_LOGGEDIN",
          JSON.stringify({
            expiresAt: Date.now() + COOKIE_TTL,
          })
        );
        res.json().then(resolve);
      } else {
        localStorage.removeItem("CVINDER_IS_LOGGEDIN");
        window.location.href = "/";
      }
    });
  });
};

window.useQuery = () => {
  const query = new URLSearchParams(window.location.search);
  const params = {};
  for (const [key, value] of query) {
    params[key] = value;
  }
  return params;
};

window.useParam = () => {
  const path = window.location.pathname.split("?")[0];
  const filePath = window.globalTree.match(path);
  const pats = filePath
    .replace("./pages", "")
    .replaceAll("_", "/")
    .replace(".js", "")
    .replace(".", "\\.")
    .replaceAll("/", "\\/")
    .replaceAll(/\[(\w*)\]/g, "(?<$1>[\\w]*)");
  const pattern = new RegExp(pats, "g");

  return pattern.exec(path).groups;
};

let globalState = {};

window.getGlobalState = () => globalState;

/**
 * @template T
 * @param {string} key
 * @param {T} initialState
 * @param {(T)=>void[]} listener
 * @returns {(T)=>void}
 */
window.useState = (key, initialState, listener = []) => {
  let state = initialState;
  const updateState = (newState) => {
    if (typeof newState === "function") {
      state = newState(state);
      listener.forEach((l) => l(state));
      key && (globalState[key] = state);
      return;
    }
    state = newState;
    key && (globalState[key] = newState);
    listener.forEach((l) => l(newState));
  };
  return updateState;
};

window.preloadImage = (url) => {
  new Image().src = url;
};
