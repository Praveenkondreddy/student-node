const { request } = require("express");
const express = require("express")
const jwt = require('jsonwebtoken');
var mysql = require('mysql');

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database:"nodemysql"
});

db.connect(function(err) {

  if (err) throw err;
  console.log("Connected!");
  
});

const app=express()
app.use(express.json());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});


app.get("/studentDetails",(req,res)=>{
  let sql="select * from student-details"

  let query=db.query(sql,(err,results) =>{
    if(err){
      throw err
    }
    res.send(results)
    console.log("get")
  })
})

app.post("/login",(req,res)=>{
    console.log(req)
    const {username,password}=req.body
    let sql=`select * from admins where username= '${username}'`
  
    let query=db.query(sql,async (err,results) =>{
      if(err){
        throw err
      }
      console.log("added")
      console.log(results[0])
      if (results[0] === undefined) {
        res.status(400);
        res.send("Invalid User");
      } else {
        if (password===results[0].password) {
          const payload = {
            username: username,
          };
          const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
          res.send({ jwtToken });
          
          console.log("jwt")
        } else {
          res.status(400);
          res.send("Invalid Password");
        }
      }
      
    })
  })

app.post("/studentForm",(req,res)=>{

  console.log(req.body)
  
  let details=req.body
  let sql=`INSERT INTO student-details SET ?`;
  let query=db.query(sql,details,err =>{
    if(err){
      console.log("add error")
      throw err
    }
  
  })
})

app.listen("8080", () => {
  console.log("server started at 8080.")
})