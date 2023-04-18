window.index__signin = () => {
  window.location.href = "/api/auth/login";
  // Assume that the user is logged in
};

const index = `
<div id="IndexScreen" class="tinder-gradient mx-auto w-full max-w-sm border flex flex-col">
<div class="h-1/2"></div>
<div class="flex flex-col items-center">
  <img src="/icons/logo.svg" alt="logo" class="logo-lg" />
  <div class="text-white text-sm px-12 my-5 text-center">
    By tapping Create Account or Sign In, you agree to our Terms. Learn
    how we process your data in our Privacy Policy and Cookies Policy.
  </div>
  <button
    onclick="index__signin()"
    class="border-2 bg-transparent text-base cursor-pointer border-white p-3 mt-3 font-medium text-white rounded-full"
  >
    SIGN IN WITH MyCourseVille
  </button>
</div>
</div>`;

export default { html: index };
