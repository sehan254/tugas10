const db = require("./db")


const check = require("express-validator").check
const registerValidation = [
    check("email").notEmpty().withMessage("silahkan masukan email!!!").isEmail().withMessage("Gmail tidak valid"),
    check("username").notEmpty().withMessage("silahkan masukan username!!!").isLength({min:5,max:10}).withMessage("username minimal 5 maximal 10 dek!").custom((value)=>{
        return new Promise((resolve,reject)=>{
            db.query("SELECT * FROM user WHERE username =?",[value],(error,result)=>{
                if (error){
                    return reject(new Error("database error"))
                }
                if (result.length>0){
                    return reject(new Error("username sudah ada"))
                }
                resolve(true)
            })
        })

    }),
    check("password").notEmpty().withMessage("silahkan masukan password!!!").isLength({min:5,max:10}).withMessage("password minimal 5 maximal 10 dek!").matches(/[A-Z]/).withMessage("password harus ada minimal 1 huruf besar").matches(/[\W_]/).withMessage("password harus ada symbol 1"),
    check("confirmPassword").notEmpty().withMessage("silahkan masukan password!!!").custom((value,{req})=>{
        if (value !== req.body.password){
            throw new Error("password tidak match dengan konfirmasi password")
            
        }
        return(true)

    })

]

module.exports = registerValidation