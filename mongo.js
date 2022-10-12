const mongoose = require("mongoose");
const config = require("./config");

const dbURL = `mongodb+srv://${config.mongo_username}:${config.mongo_password}@cluster0.qeqrrah.mongodb.net/?retryWrites=true&w=majority`;

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const PersonSchema = new mongoose.Schema({
  name: String,
  number: String,
  password: String,
});

const PersonModel = mongoose.model("PersonModel", PersonSchema);

if (name && number && password) {
  mongoose
    .connect(dbURL)
    .then((result) => {
      const person = new PersonModel({
        name: name,
        number: number,
        password: password,
      });

      return person.save();
    })
    .then((response) => {
      console.log(
        `added ${response.name} number ${response.number} to phonebook`
      );
      return mongoose.connection.close();
    })
    .catch((error) => {
      console.log(error);
    });
} else if (password) {
  mongoose.connect(dbURL).then((result) => {
    PersonModel.countDocuments(
      { password: process.argv[2] },
      function (err, count) {
        if (count !== 0) {
          PersonModel.find({}).then((response) => {
            response.forEach((person) => {
              console.log(person.name, person.number);
              return mongoose.connection.close();
            });
          });
        } else {
          console.log("person not found");
          process.exit();
        }
      }
    );
  });
}
