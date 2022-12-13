const mongoose = require("mongoose");
const employeeSchema = new mongoose.Schema({
    name:{
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    cardnumber:{
      type: Number,
      required: true
    },
    slot: {
      type: String,
      required: true
    },
    date:{
      type: Date,
      required: true
    }
  });
const Payeduser = new mongoose.model("Payeduser", employeeSchema);
module.exports  = Payeduser;