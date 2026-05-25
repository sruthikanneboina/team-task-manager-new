const mongoose = require("mongoose")
require("dotenv").config()

const express = require("express")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const User = require("./models/User")
const Task = require("./models/Task")

const app = express()

app.use(cors())
app.use(express.json())

const SECRET = process.env.JWT_SECRET || "secretkey"

app.get("/", (req, res) => {
  res.send("Backend Running")
})

app.post("/register", async (req, res) => {
  try {

    const { name, email, password } = req.body

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    })

    await newUser.save()

    res.json({
      message: "User registered successfully"
    })

  } catch (err) {

    console.log(err)

    res.status(500).json({
      message: "Server Error"
    })

  }
})

app.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      })
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    )

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password"
      })
    }

    const token = jwt.sign(
      { id: user._id },
      SECRET,
      { expiresIn: "7d" }
    )

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })

  } catch (err) {

    console.log(err)

    res.status(500).json({
      message: "Server Error"
    })

  }
})

app.post("/tasks", async (req, res) => {
  try {

    const { title } = req.body

    const newTask = new Task({
      title
    })

    await newTask.save()

    res.json({
      message: "Task created",
      task: newTask
    })

  } catch (err) {

    console.log(err)

    res.status(500).json({
      message: "Server Error"
    })

  }
})

app.get("/tasks", async (req, res) => {
  try {

    const tasks = await Task.find()

    res.json(tasks)

  } catch (err) {

    console.log(err)

    res.status(500).json({
      message: "Server Error"
    })

  }
})

app.delete("/tasks/:id", async (req, res) => {
  try {

    await Task.findByIdAndDelete(req.params.id)

    res.json({
      message: "Task deleted"
    })

  } catch (err) {

    console.log(err)

    res.status(500).json({
      message: "Server Error"
    })

  }
})

mongoose.connect(process.env.MONGO_URI)
.then(() => {

  console.log("MongoDB Connected")

  app.listen(process.env.PORT || 5000, () => {
    console.log("Server running")
  })

})
.catch((err) => {
  console.log(err)
})