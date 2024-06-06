const express = require("express");
const getDatabases = require("./services/notion");
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static("public"));

app.get("/interviews", async (req, res) => {
  const interviews = await getDatabases();
  res.json(interviews);
});

app.listen(PORT, console.log(`Server started on port ${PORT}`));
