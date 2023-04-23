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
