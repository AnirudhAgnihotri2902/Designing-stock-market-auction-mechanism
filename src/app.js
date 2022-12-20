const express = require("express");
const app = express();
const path =  require("path");
const hbs = require("hbs");
const db = require("./db/conn"); 
const Register = require("./models/registers");
const Buyers = require("./models/buyers");
const Orders = require("./models/orders");
const Stocks = require("./models/stocks");
const { json } = require("express");
const bcrypt =require('bcryptjs');
const jwt = require("jsonwebtoken");
const  bodyParser = require('body-parser');

const PORT  = process.env.PORT ||  3000;

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.set("view engine", "ejs"); 
const middleware  = (req, res, next)=>{
  res.send(`Action Prohibited`);
  //next();
}
var pendingorders = [];
app.use(bodyParser.urlencoded({extended:false}))
  
const axios = require("axios").default;
  
var  options = {
  method: 'GET',
  url: 'https://latest-stock-price.p.rapidapi.com/price',
  params: {Indices: 'NIFTY 50'},
  headers: {
    'x-rapidapi-host': 'latest-stock-price.p.rapidapi.com',
    'x-rapidapi-key': '9c4324e513mshdd7f131fa562556p1c3a3fjsnf8baf6f4993d'
  }
};
var dataFromResponse;
app.get("/",  function(req, res) {
  // axios.request(options).then(function (response) {
  //     dataFromResponse =  response.data;
  //     //res.send(dataFromResponse); 
  //   }).catch(function (error) {
  //   console.error(error)
  //   });
  //   //console.log(dataFromResponse);
  //   try{
  //   const allorder = await Orders.find();
  // console.log(allorder);
  //   }catch(error){

  //   }
    
    res.render("register");
});
app.get("/register", (req, res)=>{
    res.render("register");
});
app.get("/signin" ,(req, res)=>{
  res.render("register");
});
app.get("/addassert", (req, res)=>{
  res.render("addassert");
});
app.post("/register", async(req, res)=>{
    try{ 
      const password = req.body.password;
      const cpassword = req.body.password;
      const useremailll = await Register.findOne({email:req.body.email});
      if(useremailll){
        res.send("Email Already Exists!!");
      }
      if(password === cpassword){
        const registerEmployee = new Register({
          name : req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          linkedin: req.body.linkedin,
          password: req.body.password

        })
        const token = await registerEmployee.generateAuthToken();
        const registered =  await registerEmployee.save();
        const allorder = await Orders.find().sort ( { ammount : -1 } );
        const alltransactions = await Stocks.find ().sort ( { date : -1 } );
        const message = "You are Sucessfully Logged in";
        res.status(201).render("index",{pendingorders: allorder, transactions: alltransactions , message: message});
      }else{
        res.send("paswords are not matching")
      }
    }
    catch(error){
      res.status(400).send(error);
    }
})

app.post("/signin", async(req, res)=>{
    try{
        const email = req.body.email;
        const password =  req.body.password;
        const useremail = await Register.findOne({email:email});
        if(useremail == null)res.send("Email not found");
        const isMatch = await bcrypt.compare(req.body.password, useremail.password);
        const token = await useremail.generateAuthToken();
        const allorder = await Orders.find().sort ( { ammount : -1 } );
        const alltransactions = await Stocks.find ().sort ( { date : -1 } )
        pendingorders = allorder; 
        //console.log(alltransactions);
        if(isMatch == true){
          const message = "You are Sucessfully Logged in";
          res.status(201).render("index",{pendingorders: allorder, transactions: alltransactions , message: message});
        }
        else{
          res.send("password are not matching");
        }
    } catch(error){
        res.status(400).send(error);
    }
});

app.post("/addassert", async(req, res)=>{
  try{ 
    const buyer = new Buyers({
    name : req.body.name,
    assert: req.body.assert

  })
  
  const registered =  await buyer.save();
  const allorder = await Orders.find().sort ( { ammount : -1 } );
  const alltransactions = await Stocks.find ().sort ( { date : -1 } );
  const message = "Your assert has been sucessfully added";
  res.status(201).render("index",{pendingorders: allorder, transactions: alltransactions, message: message});
  }
  catch(error){
    res.status(400).send(error);
  }
})

app.post("/addorder", async(req, res)=>{
  try{ 
    const order = new Orders({
    name : req.body.name,
    ammount: req.body.ammount,
    type: req.body.type,
    quantity: req.body.quantity
  })
  const registered =  await order.save();
  const allorder = await Orders.find().sort ( { ammount : -1 } );
  const alltransactions = await Stocks.find ().sort ( { date : -1 } )
  const message = "Your order is added sucessfully";
  res.status(201).render("index", {pendingorders: allorder , transactions: alltransactions, message: message});
  }
  catch(error){
    res.status(400).send(error);
  }
})
app.post("/buysell", async(req, res)=>{
  try{ 
    const transaction = new Stocks({
    cust : req.body.cust,
    buyorsell: req.body.buyorsell,
    option: req.body.option,
    ammount: req.body.ammount,
    date: new Date()
  })
  const validorder = await Orders.findOne({type : req.body.buyorsell, name: req.body.cust});
  const allorder = await Orders.find().sort ( { ammount : -1 } );
  var alltransactions = await Stocks.find ().sort( { date : -1 } );
  console.log(validorder);
  if( validorder == null ){
    var msg = "Invalid Transaction No Such Order Found";
    res.render("index", {pendingorders: allorder, transactions: alltransactions, message: msg });
    // res.send(msg);
  }
  if((req.body.option == "Market" && alltransactions.length == 0)){
    var msg = "Invalid Transaction Market Value is Not set ";
    res.render("index", {pendingorders: allorder, transactions: alltransactions, message: msg });
    // res.send(msg);
  }
  if(req.body.option == "Market" && alltransactions.length >0){
    transaction.ammount = alltransactions[0].ammount;
  }
    const message = "Your Transactions has been done Sucessfully";
    const transferred =  await transaction.save();
    alltransactions = await Stocks.find ().sort( { date : -1 } );
    res.status(201).render("index", {pendingorders: allorder, transactions: alltransactions, message: message});
  }
  catch(error){
    res.status(400).send(error);
  }
})

app.listen(PORT, ()=> {
  console.log(`server running at port no ${PORT}`);
}); 