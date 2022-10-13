const mongoose = require("mongoose");
const config = require('../config')

const dbURL = config.mongo_url;

mongoose
  .connect(dbURL, { useNewUrlParser: true })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("connection error: ", error.message);
  });

const PersonSchema = new mongoose.Schema({
  name: String,
  number: String,
});

/* PersonSchema.set("toJSON", {
  transform: (document, obj) => {
    obj.id = obj._id.toString();
    delete obj._id, delete obj.__v;
  },
});
 */
const PersonModel = mongoose.model("PersonModel", PersonSchema);

module.exports = PersonModel;
