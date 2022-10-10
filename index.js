const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(morgan("tiny"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  const personsCount = persons.length;

  res.send(`<p>Phonebook has info for ${personsCount} people</p>${new Date()}`);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  //console.log(id)
  const response = person ? res.json(person) : res.status(404).end();
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);

  const person = persons.find((person) => person.id === id);

  persons = persons.filter((person) => person.id !== id);

  const response = person ? res.status(204).end() : res.json(persons);
});

app.post("/api/persons", (req, res) => {
  /* random ID generator based on
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
   */
  const generateId = () => {
    let min = persons.length;
    return Math.ceil(Math.random() * (min - min) + min + 1);
  };

  const { name, number, id } = req.body;

  const nameArr = persons.map((p) => p.name);
  const nameDuplicate = nameArr.includes(name);

  if (!name) {
    return res
      .status(400)
      .json({ error: `name field is required - HTTP ${res.statusCode}` });
  } else if (!number) {
    return res
      .status(400)
      .json({ error: `number field is required - HTTP ${res.statusCode}` });
  } else if (nameDuplicate) {
    return res.status(400).json({ error: "name must be unique" });
  }

  const person = {
    id: generateId(),
    name: name,
    number: number,
  };

  persons = persons.concat(person);
  res.status(201).json({ new_entry: person });
});

const Port = 3001;
app.listen(Port, () => {
  console.log(`Server running on port ${Port}`);
});
