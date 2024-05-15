const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const pool = require("./db");

dotenv.config();
const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cors());

app.get("/todos", async (req, res) => {
  try {
    const getToDo = await pool.query("SELECT * FROM todo_list");
    res.json(getToDo.rows);
  } catch (error) {
    res.json(error);
  }
});
app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const getListbyId = await pool.query(
      "SELECT * FROM todo_list WHERE todo_id = $1",
      [id]
    );
    res.json(getListbyId.rows);
  } catch (error) {
    res.json(error);
  }
});
app.post("/todos", async (req, res) => {
  try {
    const { desc, status } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo_list (todo_desc,todo_status) VALUES($1, $2) RETURNING *",
      [desc, status]
    );
    res.json({ newTodo, msg: "success to newToDo", success: true });
  } catch (error) {
    res.json(error);
  }
});
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { desc, status } = req.body;
    const newTodo = await pool.query(
      "UPDATE todo_list SET todo_desc = $1, todo_status =$2 WHERE todo_id = $3 RETURNING *",
      [desc, status, id]
    );
    res.json({ newTodo, msg: "success to update newToDo", success: true });
  } catch (error) {
    res.json(error);
  }
});
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const newTodo = await pool.query(
      "DELETE FROM todo_list WHERE todo_id = $1",
      [id]
    );
    res.json({ msg: "success to delete newToDo", success: true });
  } catch (error) {
    res.json(error);
  }
});
app.delete("/todos", async (req, res) => {
  try {
    const newTodo = await pool.query("DELETE FROM todo_list");
    res.json({ msg: "success to delete all newToDo", success: true });
  } catch (error) {
    res.json(error);
  }
});
app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
});
