const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("<h1>Hello, World!</h1>");
});



const Port = 3001;

app.listen(Port, () => {
  console.log(`Server running on port ${Port}`);
});
