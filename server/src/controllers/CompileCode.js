const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const CompileCode = async (req, res) => {
  const { code, language, testCases } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: "Code or language field is missing" });
  }

  try {
    const extension = getExtension(language);
    const fileName = `temp_${Date.now()}${extension}`;
    const filePath = path.resolve(__dirname, fileName);

    fs.writeFileSync(filePath, code);

    const command = getCommand(language, filePath);

    const childProcess = exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
      fs.unlinkSync(filePath);
      if (error) {
        return res.status(400).json({ error: stderr || error.message });
      }
      res.json({ output: stdout });
    });

    if (testCases) {
      childProcess.stdin.write(testCases + "\n");
    }
    childProcess.stdin.end();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getCommand = (language, filePath) => {
  switch (language) {
    case "cpp":
      return `g++ ${filePath} -o ${filePath}.out && ${filePath}.out`;
    case "python":
      return `python3 ${filePath}`;
    default:
      throw new Error("Unsupported language");
  }
};

const getExtension = (language) => {
  switch (language) {
    case "cpp": return ".cpp";
    case "python": return ".py";
    default: throw new Error("Unsupported language");
  }
};

module.exports = CompileCode;
