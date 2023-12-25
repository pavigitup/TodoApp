const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const dbPath = path.join(__dirname, "todoApplication.db");
let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
  }
};
initializeDBAndServer();

app.get("/todos/", async (request, response) => {
  const {
    status = "",
    priority = "",
    search_q = "",
    category = "",
  } = request.query;
  const getAllTodo = `
    SELECT *
    FROM todo
     WHERE status LIKE '%${status}%' AND
    priority LIKE '%${priority}%' AND
    todo LIKE '%${search_q}%' AND
    category LIKE '%${category}%'
    `;
  const allTodo = await db.all(getAllTodo);
  const allCapsTodo = (allTodo) => {
    return {
      id: allTodo.id,
      todo: allTodo.todo,
      priority: allTodo.priority,
      status: allTodo.status,
      category: allTodo.category,
      dueDate: allTodo.due_date,
    };
  };
  response.send(allTodo.map((e) => allCapsTodo(e)));
});

module.exports = app;
