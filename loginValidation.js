const check = require("express-validator").check
const db = require("./db")
const loginValidation = [
    check ("email").notEmpty().withMessage("silahkan masukan email!!!"),

    check("password").notEmpty().withMessage("silahkan masukan password!!!").custom((value,{req}) =>{
        return new Promise((resolve,reject)=>{
            db.query("SELECT * FROM user WHERE password =?",[value],(error,result)=>{
                if (error){
                    return reject(new Error("database error"))
                }
                if (result.length==0){
                    return reject(new Error("password salah!"))
                }
                resolve(true)
            })    
        })
    })    
]

module.exports = loginValidation