"use client";
import { useEffect, useState } from "react";
import axios from "axios";
axios.defaults.baseURL =
  "https://todo-ahgb.onrender.com" || process.env.API_URL;
export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  useEffect(() => {
    const list = axios
      .get("/todos")
      .then((res) => {
        setTodoList(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  async function handleDeleteAll(e) {
    e.preventDefault();
    const res = await axios.delete("/todos");
    setTodoList([]);
  }

  async function handleAdd(e) {
    e.preventDefault();
    const data = {
      desc: inputValue,
      status: false,
    };
    const res = await axios.post("/todos", data);
    if (res.data.success) {
      setTodoList((prevValue) => [...prevValue, res.data.newTodo.rows[0]]);
    }
    setInputValue("");
  }

  const handleEdit = (id) => {
    setTodoList((prevList) =>
      prevList.map((item) =>
        item.todo_id === id ? { ...item, editMode: true } : item
      )
    );
  };

  const handleUpdate = async (id, editedTodo) => {
    const data = {
      desc: editedTodo,
      status: false,
    };
    const res = await axios.put(`/todos/${id}`, data);
    if (res.data.success) {
      setTodoList((prevList) =>
        prevList.map((item) =>
          item.todo_id === id ? { ...item, editMode: false } : item
        )
      );
    }
  };

  async function handleDelete(e, id) {
    const res = await axios.delete(`/todos/${id.todo_id}`);
    if (res.data.success) {
      setTodoList((prevValue) =>
        prevValue.filter((item) => item.todo_id !== id.todo_id)
      );
    }
  }

  async function handleChecked(id, editedTodo, status) {
    const data = {
      desc: editedTodo,
      status: !status,
    };
    const res = await axios.put(`/todos/${id}`, data);
    if (res.data.success) {
      setTodoList((prevList) =>
        prevList.map((item) =>
          item.todo_id === id
            ? { ...item, todo_status: !item.todo_status }
            : item
        )
      );
    }
  }
  const filteredTodoList = filterStatus
    ? todoList.filter((item) =>
        filterStatus === "completed" ? item.todo_status : !item.todo_status
      )
    : todoList;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1 style={{ color: "white" }}>To Do List</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "10px",
        }}
      >
        <form>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e)}
            style={{
              margin: "5px",
              padding: "8px 15px 8px 15px",
            }}
          ></input>

          <button
            style={{
              margin: "5px",
              padding: "8px 15px 8px 15px",
              backgroundColor: " rgb(48, 118, 114)",
              border: "none",
              borderRadius: "5px",
              color: "white",
            }}
            onClick={(e) => handleAdd(e)}
          >
            Add
          </button>

          <button
            style={{
              margin: "5px",
              padding: "8px 15px 8px 15px",
              backgroundColor: "rgb(223,48,48)",
              border: "none",
              borderRadius: "5px",
              color: "white",
            }}
            onClick={(e) => handleDeleteAll(e)}
          >
            Delete All
          </button>
        </form>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            width: "100px",
            height: "25px",
            outline: "none",
          }}
        >
          <option value="">All</option>
          <option value="completed">Done</option>
          <option value="not_completed">Not Done</option>
        </select>
        <div>
          {filteredTodoList.map((item, index) => (
            <div
              key={item.todo_id}
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <input
                type="checkbox"
                checked={item.todo_status}
                onChange={(e) =>
                  handleChecked(item.todo_id, item.todo_desc, item.todo_status)
                }
                style={{
                  width: "15px",
                  height: "15px",
                  border: "2px solid #ddd",
                  backgroundColor: item.todo_status
                    ? "rgb(101,75,244)"
                    : "white",
                  outline: "none",
                  cursor: "pointer",
                  borderRadius: "50%", // or any desired value to make it rounded
                  appearance: "none",
                }}
              ></input>
              {!item.editMode ? (
                <p
                  style={{
                    textDecoration: item.todo_status ? "line-through" : "none",
                    width: "100px",
                  }}
                >
                  {item.todo_desc}
                </p>
              ) : (
                <input
                  type="text"
                  value={item.todo_desc}
                  style={{
                    margin: "5px",
                    padding: "8px 15px 8px 15px",
                  }}
                  onChange={(e) =>
                    setTodoList((prevList) =>
                      prevList.map((todo) =>
                        todo.todo_id === item.todo_id
                          ? { ...todo, todo_desc: e.target.value }
                          : todo
                      )
                    )
                  }
                ></input>
              )}
              {item.editMode ? (
                <button
                  style={{
                    margin: "5px",
                    padding: "8px 15px 8px 15px",
                    backgroundColor: "rgb(101,75,244)",
                    border: "none",
                    borderRadius: "5px",
                    color: "white",
                  }}
                  onClick={() => handleUpdate(item.todo_id, item.todo_desc)}
                >
                  Update
                </button>
              ) : (
                <button
                  style={{
                    margin: "5px",
                    padding: "8px 15px 8px 15px",
                    backgroundColor: "rgb(101,75,244)",
                    border: "none",
                    borderRadius: "5px",
                    color: "white",
                  }}
                  onClick={() => handleEdit(item.todo_id)}
                >
                  Edit
                </button>
              )}
              <button
                style={{
                  margin: "5px",
                  padding: "8px 15px 8px 15px",
                  backgroundColor: "rgb(223,48,48)",
                  border: "none",
                  borderRadius: "5px",
                  color: "white",
                }}
                onClick={(e) => handleDelete(e, item)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
