import React, { useState, useEffect } from "react"

function App() {

  const [isLogin, setIsLogin] = useState(false)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [message, setMessage] = useState("")

  const [taskTitle, setTaskTitle] = useState("")
  const [tasks, setTasks] = useState([])

  const user = JSON.parse(localStorage.getItem("user"))

  const token = localStorage.getItem("token")

  const handleSubmit = async () => {

    const url = isLogin
      ? "https://team-task-manager-new-production-14b7.up.railway.app/login"
      : "https://team-task-manager-new-production-14b7.up.railway.app/register"

    const bodyData = isLogin
      ? { email, password }
      : { name, email, password }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bodyData)
    })

    const data = await response.json()

    if (data.message) {
      setMessage(data.message)
    }

    if (data.token) {

      localStorage.setItem("token", data.token)

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      )

      window.location.reload()
    }
  }

  const fetchTasks = async () => {

    if (!token) return

    const response = await fetch(
      "https://team-task-manager-new-production-14b7.up.railway.app/tasks",
      {
        headers: {
          authorization: token
        }
      }
    )

    const data = await response.json()

    if (Array.isArray(data)) {
      setTasks(data)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const createTask = async () => {

    if (!taskTitle) return

    const response = await fetch(
      "https://team-task-manager-new-production-14b7.up.railway.app/tasks",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: token
        },
        body: JSON.stringify({
          title: taskTitle
        })
      }
    )

    const data = await response.json()

    if (data.task) {
      setTasks([...tasks, data.task])
      setTaskTitle("")
    }
  }

  const deleteTask = async (id) => {

    await fetch(
      `https://team-task-manager-new-production-14b7.up.railway.app/tasks/${id}`,
      {
        method: "DELETE",
        headers: {
          authorization: token
        }
      }
    )

    setTasks(tasks.filter((task) => task._id !== id))
  }

  if (user) {

    return (
      <div style={{ padding: 40 }}>

        <h1>Dashboard</h1>

        <h2>Welcome {user.name}</h2>

        <p>{user.email}</p>

        <button onClick={() => {
          localStorage.clear()
          window.location.reload()
        }}>
          Logout
        </button>

        <hr />

        <h2>Create Task</h2>

        <input
          placeholder="Task title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />

        <button onClick={createTask}>
          Add Task
        </button>

        <hr />

        <h2>Tasks</h2>

        {tasks.map((task) => (

          <div
            key={task._id}
            style={{
              border: "1px solid gray",
              padding: 10,
              marginBottom: 10
            }}
          >

            <h3>{task.title}</h3>

            <button
              onClick={() => deleteTask(task._id)}
            >
              Delete
            </button>

          </div>

        ))}

      </div>
    )
  }

  return (

    <div style={{ padding: 40 }}>

      <h1>Team Task Manager</h1>

      {!isLogin && (
        <>
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <br /><br />
        </>
      )}

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleSubmit}>
        {isLogin ? "Login" : "Register"}
      </button>

      <br /><br />

      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin
          ? "Go To Register"
          : "Go To Login"}
      </button>

      <h2>{message}</h2>

    </div>
  )
}

export default App