const { exec } = require('child_process');
const fs = require("fs");
const path = require("path");

const CompileCode = async (req, res) => {
  const { code, language, testCases } = req.body;
  
  if (!code || !language) {
    return res.status(400).json({ error: "Code or language field is missing" });
  }

  const extension = getExtension(language);
  const fileName = `/tmp/temp${extension}`;

  try {
    fs.writeFileSync(fileName, code);

    const command = getCommand(language, fileName);
    const input = testCases;
    const childProcess = exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
      if (error) {
        return res.status(400).json({ error: stderr || error.message });
      }
      res.json({ output: stdout });
    });

    if (input) {
      childProcess.stdin.write(input + "\n");
    }
    childProcess.stdin.end();

  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (fs.existsSync(fileName)) fs.unlinkSync(fileName);
  }
};

const getCommand = (language, fileName) => {
  switch (language) {
    case "cpp":
      return `g++ ${fileName} -o /tmp/temp && /tmp/temp`;
    case "python":
      return `python3 ${fileName}`;
    case "c":
      return `gcc ${fileName} -o /tmp/temp && /tmp/temp`;
    default:
      throw new Error(`${language} is not supported at this time.`);
  }
};

const getExtension = (language) => {
  switch (language) {
    case "cpp": return ".cpp";
    case "python": return ".py";
    case "c": return ".c";
    default: throw new Error(`${language} is not supported at this time.`);
  }
};

module.exports = CompileCode;
