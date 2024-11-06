const bodyParser = require('body-parser');
const {exec} = require('child_process');
const fs = require("fs");

const CompileCode = async(req, res) => {
  const {code, language} = req.body;
  try {
    const extension = getExtension(language);
    const fileName = `temp.${extension}`;
    fs.writeFileSync(fileName, code);

    const command = getCommand(language, fileName);

    exec(command, {timeout: 5000}, (error, stdout, stderr)=>{
      if(error){
        res.status(400).json({error: stderr || error.message});
      }
      else{
        res.json({output: stdout});
      }
      fs.unlinkSync(fileName);
    })

  } catch (error) {
    res.status(501).send("Internal server error");
  }
}

const getCommand = (language, fileName) => {
  switch (language){
    case "cpp":
      return `g++ ${fileName} -o temp && ./temp`;

    case "java": 
      return `javac ${fileName} && java ${fileName.split('.')[0]}`;

    case "python":
      return `python3 ${fileName}`;

    case "javascript":
      return `node ${fileName}`;
  }
}

const getExtension = (language) => {
  switch (language){
    case 'cpp':
      return ".cpp";
    case 'java':
      return ".java";
    case 'python':
      return '.py';
    case 'javascript':
      return '.js'
  }
}

module.exports = CompileCode;
