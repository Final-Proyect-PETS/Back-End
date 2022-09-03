require("dotenv").config();

//DB connection
const mongoose = require("mongoose");

//Model
//const Persona = require("../src/models/Prueba");

module.exports = () => {
  mongoose
    .connect(
      process.env.MONGO_URI ||
        `mongodb+srv://PFHENRY_user:BlljBxfxHrJSnYyY@cluster0.zcau31k.mongodb.net/?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .catch((e) => console.log("error de conexión", e));
};
