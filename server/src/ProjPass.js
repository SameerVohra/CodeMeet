const ProjPass = () => {
  const words = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*";
  const numbers = "0123456789";

  let pass = "";

  while(pass.length<6){
    pass+=words[Math.floor(Math.random()*words.length)];
    pass+=numbers[Math.floor(Math.random()*numbers.length)]
  }
  console.log(pass.slice(0,6))
  return pass.slice(0,6);
}

module.exports = ProjPass;
