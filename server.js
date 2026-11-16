const express = require("express");
const Database = require("better-sqlite3");

const app = express();
const db = new Database("todos.db");

app.use(express.json()); // lets the server read JSON sent from the page
app.use(express.static("public")); // will serve our frontend page later

// Create the table if it doesn't exist
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER DEFAULT 0
  )
`,
).run();

// READ: get all to-dos
app.get("/todos", (req, res) => {
  const todos = db.prepare("SELECT * FROM todos").all();
  res.json(todos);
});

// CREATE: add a new to-do
app.post("/todos", (req, res) => {
  const result = db
    .prepare("INSERT INTO todos (title) VALUES (?)")
    .run(req.body.title);
  res.json({ id: result.lastInsertRowid, title: req.body.title, done: 0 });
});

// UPDATE: mark a to-do as done or not done
app.put("/todos/:id", (req, res) => {
  db.prepare("UPDATE todos SET done = ? WHERE id = ?").run(
    req.body.done,
    req.params.id,
  );
  res.json({ ok: true });
});

// DELETE: remove a to-do
app.delete("/todos/:id", (req, res) => {
  db.prepare("DELETE FROM todos WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
