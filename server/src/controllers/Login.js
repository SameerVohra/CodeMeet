const User = require("../models/User");
const {decryptPass} = require("password-encrypt-decrypt")

const Login = async(req, res) => {
  const {email, password} = req.body;
  const secret_key = process.env.SECRET_KEY;
  console.log(email, password)
  try {
    console.log("Logginin")
    const user = await User.findOne({email: email});
    if(!user){
      console.log("wrong email");
      res.status(404).send("Wrong Email");
      return;
    }
   
    if(decryptPass(user.password, secret_key)!==password){
      res.status(404).send("Wrong Email/Password");
      return;
    }

    res.status(201).json({email});
  } catch (error) {
    console.log(error);
    res.status(501).json("Internal Server Error");
    return;
  }
}

module.exports = Login;
