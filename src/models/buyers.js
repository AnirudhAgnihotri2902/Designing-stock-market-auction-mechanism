const mongoose = require("mongoose");
const employeeSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    assert: {
      type: Number,
    },
    orders:[{
        ammount:{
          type: Number
        },
        quantity: {
          type: Number
        }
    }]
});


const Buyers = new mongoose.model("Buyers", employeeSchema);
module.exports  = Buyers;