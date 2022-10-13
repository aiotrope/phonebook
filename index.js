const config = require("./config");
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const PersonModel = require("./models/person");

const app = express();

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

app.use(express.static("build"));

app.get("/api/persons", (req, res, next) => {
  PersonModel.find({})
    .then((persons) => {
      res.json(persons);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  PersonModel.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => {
      console.log(err.message);
      next(error);
    });
});

app.post("/api/persons", (req, res, next) => {
  const { name, number } = req.body;
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
    person
      .save()
      .then((newPerson) => {
        console.log(newPerson);
        res.status(201).json({ new_person: newPerson });
      })
      .catch((error) => next(error));
  }
});

const notFoundEndpoint = (req, res) => {
  res.status(404).send({ error: "endpoint not found" });
};

app.use(notFoundEndpoint);

const errorHandler = (err, req, res, next) => {
  console.log(err.message);
  console.error(err.stack);
  res.status(500);
  res.send("error", { error: err });

  next(err);
};

app.use(errorHandler);

const port = config.port;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
