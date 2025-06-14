const express = require("express");
const app = express();
const PORT = process.env.EXPRESS_CONTAINER_PORT || 4000;
const path = require("path");
const Items = require("./db/models/Items.js");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

// ✅ KEEP: Read-only endpoint
app.get("/items", (req, res) => {
  Items.fetchAll()
    .then((items) => {
      res.json(items.serialize());
    })
    .catch((err) => {
      console.log("error", err);
    });
});

// ❌ DISABLED: Write operations for demo security
/*
app.post( '/', (req, res) => {
  // ADD ITEM - Disabled for portfolio demo
  res.status(405).json({ 
    message: "Demo mode: Adding items disabled for portfolio security",
    action: "add"
  });
})

app.put('/save', (req, res) => {
  // SAVE/REORDER - Disabled for portfolio demo
  res.status(405).json({ 
    message: "Demo mode: Saving disabled for portfolio security",
    action: "save"
  });
})

app.delete( '/:id', (req, res) => {
  // DELETE ITEM - Disabled for portfolio demo
  res.status(405).json({ 
    message: "Demo mode: Deleting items disabled for portfolio security",
    action: "delete"
  });
})

app.put( '/:id', (req, res) => {
  // EDIT ITEM - Disabled for portfolio demo
  res.status(405).json({ 
    message: "Demo mode: Editing items disabled for portfolio security",
    action: "edit"
  });
})
*/

// 📖 Demo info endpoint
app.get("/demo-info", (req, res) => {
  res.json({
    message: "Portfolio Demo - Read Only Mode",
    features: [
      "Drag & drop visualization (client-side only)",
      "React + Redux architecture",
      "Docker containerization",
      "PostgreSQL database",
      "Express.js API",
    ],
    note: "Write operations disabled for security. Full functionality available in development.",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Portfolio Kanban API listening on ${PORT}...`);
  console.log(`📖 Demo mode: Read-only for security`);
});
