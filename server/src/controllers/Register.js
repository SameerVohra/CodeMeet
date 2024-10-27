const User = require("../models/User");
const {encryptPass} = require("password-encrypt-decrypt");

const Register = async(req, res) => {
  const {email, password} = req.body;
  const secret_key = process.env.SECRET_KEY;

  try {
    const user = await User.findOne({email: email});
    if(user){
      res.status(403).send("User Already exists");
      return;
    }

    const newUser = new User({
      email, 
      password: encryptPass(password, secret_key, 9)
    })

    await newUser.save();

    res.status(201).json({email: email});
  } catch (error) {
    console.log(error)
    res.status(501).send("Internal Server Error");
  }
}

module.exports = Register
