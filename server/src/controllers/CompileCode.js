const CompileCode = async(req, res) => {
  const {code, testCase, language, extension} = req.body;
  try {
    
  } catch (error) {
    res.status(501).send("Internal server error");
  }
}
