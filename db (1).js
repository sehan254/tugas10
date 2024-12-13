const { error, log } = require("console");
const mysql = require("mysql2");
const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"login"
})

try{
    db.connect()
    console.log("database sudah terhubung")
}catch(error){
    console.log(error)
}

module.exports = db

