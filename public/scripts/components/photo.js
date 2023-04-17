const files = [];
const data = [];

const addFile = `<label class="custom-file-upload">
<input class="hidden" type="file" id="photo__fileupload"/>
<img src="/icons/uploadAdd.svg" class="upload-button absolute" />
</label>`;

const photo = `
<div
id="AddPhotosScreen"
class="mx-auto w-full max-w-sm border flex flex-col"
>
<div class="w-full flex bg-secondary">
  <div class="bg-primary h-1" style="width: 80%"></div>
</div>
<div class="mx-12 flex h-full flex-col">
  <div class="text-3xl mt-10 font-bold">Add Photos</div>
  <div class="text-secondary mt-3 text-sm">
    Add at least 2 photos to continue
  </div>
  <div class="h-full">
    <div class="flex gap-4 my-2">
      <div id= class="bg-secondary rounded-2xl p-3 w-full img-upload relative"></div>
      <div id= class="bg-secondary rounded-2xl p-3 w-full img-upload relative"></div>
      <div id= class="bg-secondary rounded-2xl p-3 w-full img-upload relative"></div>
    </div>
    <div class="flex gap-4 my-2">
      <div class="bg-secondary rounded-2xl p-3 w-full img-upload relative"></div>
      <div class="bg-secondary rounded-2xl p-3 w-full img-upload relative"></div>
      <div class="bg-secondary rounded-2xl p-3 w-full img-upload relative"></div>
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
  html: photo,
  onLoad: () => {},
};
