const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phone: {
      type: Number,
      required: true
    },
    age: {
      type: Number,
      required: true
    },

    password: {
      type: String,
      required: true
    }
});

const Register = new mongoose.model("Register", employeeSchema);
module.exports  = Register;