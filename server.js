const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

// Determine where index.html is located
const publicDir = path.join(__dirname, "public");
const rootIndex = path.join(__dirname, "index.html");

// Serve static files
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
} else {
  app.use(express.static(__dirname));
}

// Route for home page
app.get("/", (req, res) => {
  if (fs.existsSync(publicDir + "/index.html")) {
    res.sendFile(path.join(publicDir, "index.html"));
  } else if (fs.existsSync(rootIndex)) {
    res.sendFile(rootIndex);
  } else {
    res.status(404).send("index.html not found!");
  }
});

// Fallback for other routes (Optional)
app.get("*", (req, res) => {
  if (fs.existsSync(publicDir + "/index.html")) {
    res.sendFile(path.join(publicDir, "index.html"));
  } else if (fs.existsSync(rootIndex)) {
    res.sendFile(rootIndex);
  } else {
    res.status(404).send("Page not found!");
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
