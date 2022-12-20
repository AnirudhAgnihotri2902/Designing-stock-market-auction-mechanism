const mongoose = require("mongoose");
const employeeSchema = new mongoose.Schema({
    cust:{
      type: String,
      required: true     
    },
    buyorsell:{
      type: String,
      required: true
    },
    option: {
      type: String,
      required: true,
    },
    ammount:{
      type: Number,
      required: true
    },
    date:{
      type: Date,
      required: true
    }
});

const Stocks = new mongoose.model("Stocks", employeeSchema);
module.exports  = Stocks;