const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  priority: String,
  status: String,
  assignedTo: String,
  dueDate: String,
  projectId: String
})

module.exports = mongoose.model("Task", taskSchema)
