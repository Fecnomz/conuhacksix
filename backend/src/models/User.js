const mongoose = require('mongoose')

const agentSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true},
  avatar: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  prompt: { type: String, required: true },
  initialResponse: { type: String, required: true },
  status: { type: Boolean, required: true },
  phoneNumber: { type: String, required: false }
})

const userSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  agents: [agentSchema],
  companyURI: { type: String, required: false },
  companyDescription : { type: String, required: false }
})

const User = mongoose.model('User', userSchema)
module.exports = User
