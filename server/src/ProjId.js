const ProjId = () => {
  const words = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOQPRSTUVWXYZ";
  const numbers = "013456789";
  let id = "";

  while(id.length < 6){
    id+=words[Math.floor(Math.random()*words.length)];
    id+=numbers[Math.floor(Math.random()*numbers.length)]
  }

  console.log(id.slice(0,6));

  return id.slice(0, 6);
}

module.exports = ProjId;
