const config = require("./config");
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const PersonModel = require("./models/person");

const app = express();

app.use(express.static("build"));

app.use(express.json());

logger.token("reqBody", (req, res) => JSON.stringify(req.body));

app.use(
  logger(function (tokens, req, res) {
    if (req.method === "POST") {
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.req(req, res, "content-length"),
        "-",
        tokens["response-time"](req, res),
        "ms",
        tokens["reqBody"](req, res, JSON.stringify(req.body)),
      ].join(" ");
    }
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.req(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
    ].join(" ");
  })
);

app.use(cors());

app.get("/api/persons", (req, res) => {
  PersonModel.find({}).then((persons) => {
    res.json(persons);
  });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  PersonModel.findById({ _id: id })
    .then((person) => {
      person.remove();
      res.status(204).json({ message: `${id} deleted` });
    })
    .catch((err) => {
      console.log(err.message);
    });
});

app.post("/api/persons", (req, res) => {
  const { name, number, idx } = req.body;
  if (!name) {
    return res
      .status(400)
      .json({ error: `name field is required - HTTP ${res.statusCode}` });
  } else if (!number) {
    return res
      .status(400)
      .json({ error: `number field is required - HTTP ${res.statusCode}` });
  } else {
    const person = new PersonModel({
      name: req.body.name,
      number: req.body.number,
    });
    person.save().then((newPerson) => {
      console.log(newPerson);
      res.status(201).json({ new_person: newPerson });
    });
  }
});

const port = config.port;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
