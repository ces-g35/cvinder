window.index__signin = () => {
  window.location.href = "/signin";
  // Assume that the user is logged in
};

const error404 = `
  <div id="404Screen" class="tinder-gradient text-center text-white mx-auto w-full max-w-sm border flex flex-col">
    404 Error
  </div>`;

export default {
  html: error404,
};
