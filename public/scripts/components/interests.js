const interestOptions = [
  "90s",
  "Harry Potter",
  "Star Wars",
  "Marvel",
  "DC",
  "Anime",
  "Video Games",
  "Music",
  "Movies",
  "TV Shows",
  "Books",
];

const selectedInterests = [];

const interests = `
    <div
      id="InterestScreen"
      class="mx-auto w-full max-w-sm border flex flex-col"
    >
      <div class="w-full flex bg-secondary">
        <div class="bg-primary h-1" style="width: 80%"></div>
      </div>
      <div class="mx-12 flex h-full flex-col">
        <div class="text-3xl mt-10 font-bold">Interests</div>
        <div class="text-secondary mt-3 text-sm">
          Let everyone know what you’re interested in by adding it to your
          profile.
        </div>
        <div class="h-full">
          <div id="interests__wrap" class="flex flex-wrap gap-2 my-2">
            
          </div>
        </div>
        <div
          id="interests__continue"
          class="my-12 text-center font-bold rounded-full bg-button-secondary text-secondary-contrast p-2"
        >
          CONTINUE <span id="interests__count"></span>
        </div>
      </div>
    </div>`;

export default {
  html: interests,
  onLoad: () => {
    const interestsWrap = document.getElementById("interests__wrap");
    const interestsContinue = document.getElementById("interests__continue");

    interestsContinue.addEventListener("click", () => {
      if (selectedInterests.length >= 5) {
        window.location.href = "/add-photos";
      }
    });

    interestOptions.forEach((interest) => {
      const interestDiv = document.createElement("div");
      interestDiv.classList.add(
        "border-2",
        "border-secondary",
        "text-sm",
        "font-bold",
        "px-2",
        "py-1",
        "text-secondary",
        "rounded-full",
        "cursor-pointer"
      );
      interestDiv.innerText = interest;
      interestDiv.addEventListener("click", () => {
        interests__count.innerText = ` ${selectedInterests.length + 1}/5`;
        if (selectedInterests.length >= 4) {
          interestsContinue.classList.add("text-white");
          interestsContinue.classList.add("cursor-pointer");
          interestsContinue.classList.add("bg-primary");
          interestsContinue.classList.remove("text-secondary-contrast");
          interestsContinue.classList.remove("bg-button-secondary");
        }
        if (selectedInterests.includes(interest)) {
          selectedInterests.splice(selectedInterests.indexOf(interest), 1);
          interestDiv.classList.add("border-secondary");
          interestDiv.classList.remove("text-primary");
          interestDiv.classList.add("text-secondary");
        } else {
          selectedInterests.push(interest);
          interestDiv.classList.remove("border-secondary");
          interestDiv.classList.add("text-primary");
          interestDiv.classList.remove("text-secondary");
        }
      });
      interestsWrap.appendChild(interestDiv);
    });
  },
};
