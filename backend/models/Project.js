const mongoose = require("mongoose")

const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  admin: String,
  members: [String]
})

module.exports = mongoose.model("Project", projectSchema)
