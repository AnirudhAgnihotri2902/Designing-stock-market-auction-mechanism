const mongoose = require("mongoose");
const employeeSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    type:{
      type: String,
      required: true
    },
    ammount:{
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    
});


const Orders = new mongoose.model("Orders", employeeSchema);
module.exports  = Orders;