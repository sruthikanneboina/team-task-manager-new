const mongoose = require("mongoose")
require("dotenv").config()

const express = require("express")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const User = require("./models/User")
const Task = require("./models/Task")
const Project = require("./models/Project")

const app = express()

app.use(cors())
app.use(express.json())

const SECRET = process.env.JWT_SECRET || "secretkey"

app.get("/", (req, res) => {
  res.send("Backend Running")
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
