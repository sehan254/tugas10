const express = require("express");
const app = express();
const db = require("./db")
const {validationResult} = require("express-validator")
const registerValidation = require("./registerValidation");
const loginValidation =  require("./loginValidation")
const jwt = require("jsonwebtoken")
const verifyToken = require("./verifyToken")


const secretKey = "sigmaBoy"


app.use(express.json());
app.post("/register",registerValidation,(req,res) =>{
    const{email,username,password} = req.body
    const result = validationResult(req)
    if(!result.isEmpty()){
        return res.status(400).json({validationMessage:result.array().map((err)=>({
            message:err.msg
        }))})
    }
    db.query("INSERT INTO user (email,username,password) VALUES(?,?,?) ", [email,username,password])
    res.status(201).json({pesan:"Berhasil Regist"})
})

app.post("/login",loginValidation,(req,res)=>{
    const{email} = req.body
    const currentTime = Math.floor(Date.now()/1000)
    const result = validationResult(req)
    if(!result.isEmpty()){
        return res.status(400).json({validationMessage:result.array().map((err)=>({
            message:err.msg
        }))})
    }
    db.query("SELECT * FROM user WHERE email = ?",[email],(err,result)=>{
        if(err) throw err
        if (result.length == 0){
            return res.status(400).json({pesam:"email blum ada,silahkan daftar"})    
        }
        const{id,username} = result[0]
        const user  = {
            userId:id,
            username:username,
            iat:currentTime,
        }
        const token = jwt.sign(user,secretKey,{expiresIn:"1h"})

        res.status(200).json({pesan:token})
    })

    
})

app.put("/updateEmail/:id",verifyToken,(req,res)=>{
    const {id} = req.params
    const {email} = req.body
    db.query("UPDATE user SET email = ? WHERE id = ? ",[email,id],(err,result)=>{
        if(err) throw err
        return res.status(200).json({pesan:"email sudah di perbarui"})
    })
})




app.listen(3000,()=>{
    console.log("listen to 3000")
}) 