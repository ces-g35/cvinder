const a = `
<script>
</script>

`;

// extract content between script tags
const scriptContent = a
  .match(/<script>(.|\n)*?<\/script>/g)[0]
  .replace(/<script>|<\/script>/g, "");

console.log(scriptContent);
