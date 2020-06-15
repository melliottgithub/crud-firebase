import React, { useEffect, useState } from "react";
import { firebase } from "./firebase";

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const db = firebase.firestore();
        const data = await db.collection("tasks").get();
        const arrayData = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(arrayData);
      } catch (error) {
        alert(error);
      }
    };
    getData();
  }, []);

  const addHandler = async (e) => {
    e.preventDefault();
    if (!task.trim()) {
      return;
    }
    try {
      const db = firebase.firestore();

      const newTask = {
        name: task,
        date: Date.now(),
      };

      const data = await db
        .collection("tasks")
        .add({ name: task, date: Date.now() });

      setTasks([...tasks, { id: data.id, ...newTask }]);

      setTask("");
    } catch (error) {}
  };

  const deleteHandler = async (id) => {
    try {
      const db = firebase.firestore();
      await db.collection("tasks").doc(id).delete();

      const arrayFilter = tasks.filter((item) => item.id !== id);
      setTasks(arrayFilter);
    } catch (error) {}
  };

  const actEditHandler = (item) => {
    setEdit(true);
    setTask(item.name);
    setId(item.id);
  };

  const editHandler = async (e) => {
    e.preventDefault();
    if (!task.trim()) {
      return;
    }
    try {
      const db = firebase.firestore();
      await db.collection("tasks").doc(id).update({ name: task });

      const arrayEdited = tasks.map((item) =>
        item.id === id ? { id: item.id, date: item.date, name: task } : item
      );
      setTasks(arrayEdited);

      setEdit(false);
      setId("");
      setTask("");
    } catch (error) {}
  };

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-md-6">
          <h3>{edit ? "Editing Task List" : "Task list"}</h3>
          <ul className="list-group">
            {tasks.map((item) => (
              <li className="list-group-item" key={item.id}>
                {item.name}
                <button
                  onClick={() => deleteHandler(item.id)}
                  className="btn btn-danger btn-sm float-right"
                >
                  Delete
                </button>
                <button
                  onClick={() => actEditHandler(item)}
                  className="btn btn-warning mr-2 btn-sm float-right"
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-6">
          <h3>{edit ? "Edit Task" : "Add Task"}</h3>

          <form onSubmit={edit ? editHandler : addHandler}>
            <input
              type="text"
              placeholder="Enter task"
              className="form-control mb-2"
              onChange={(e) => setTask(e.target.value)}
              value={task}
            />
            <button
              type="submit"
              className={
                edit ? "btn btn-warning btn-block" : "btn btn-dark btn-block"
              }
            >
              {edit ? "Edit" : "Add"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
