import {
  addItem,
  updateItem,
  deleteItem,
  getTable,
  getItem,
} from "./db/index.js";

// addItem("test", { message: "hello world" }).then((data) => console.log(data));
//

// updateItem(
//   "test",
//   { _id: "3c0b0210-6dbd-4168-9f17-a4d0fcfb7417" },
//   { message: "change 2", wow: 2 }
// ).then((d) => console.log(d));

// deleteItem("test", { _id: "3c0b0210-6dbd-4168-9f17-a4d0fcfb7417" });

// getTable("test").then((d) => console.log(d));

getItem("test", { _id: "test" }).then((d) => console.log(d.Item));
