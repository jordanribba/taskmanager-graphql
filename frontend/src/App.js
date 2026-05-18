import React, { useState } from "react";
import axios from "axios";

function App() {

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  // Obtener tareas
  const getTasks = async () => {

    const query = `
      query {
        getTasks {
          id
          title
          completed
        }
      }
    `;

    const response = await axios.post(
      "http://localhost:4000/graphql",
      {
        query
      }
    );

    setTasks(response.data.data.getTasks);

  };

  // Crear tarea
  const createTask = async () => {

    const mutation = `
      mutation {
        createTask(title: "${title}") {
          id
          title
        }
      }
    `;

    await axios.post(
      "http://localhost:4000/graphql",
      {
        query: mutation
      }
    );

    setTitle("");

    getTasks();

  };

  return (

    <div style={{ padding: "20px" }}>

      <h1>Task Manager GraphQL</h1>

      <button onClick={getTasks}>
        Obtener tareas
      </button>

      <br /><br />

      <input
        type="text"
        placeholder="Nueva tarea"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button onClick={createTask}>
        Crear tarea
      </button>

      <ul>

        {tasks.map(task => (

          <li key={task.id}>
            {task.title}
          </li>

        ))}

      </ul>

    </div>

  );

}

export default App;