const COOKIE_TTL = 1209600;
window.useGuard = () => {
  const IS_LOGGEDIN = localStorage.getItem("CVINDER_IS_LOGGEDIN");
  if (IS_LOGGEDIN) {
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
    } else {
      localStorage.removeItem("CVINDER_IS_LOGGEDIN");
      window.location.href = "/";
    }
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
    key && (globalState[key] = state);
    listener.forEach((l) => l(newState));
  };
  return updateState;
};
