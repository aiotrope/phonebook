const express = require("express");

const app = express();

const Port = 3001;

app.listen(Port, () => {
  console.log(`Server running on port ${Port}`);
});
