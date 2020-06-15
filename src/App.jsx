import React, { useEffect, useState } from "react";
import { firebase } from "./firebase";

function App() {
  const [tasks, setTasks] = useState([]);

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

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-md-6">
          <ul className="list-group">
            {tasks.map((item) => (
              <li className="list-group-item" key={item.id}>{item.name}</li>
            ))}
          </ul>
        </div>
        <div className="col-md-6">Form</div>
      </div>
    </div>
  );
}

export default App;
