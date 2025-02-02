const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  avatar: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  prompt: { type: String, required: true },
  initialResponse: { type: String, required: true },
  status: { type: Boolean, required: true }
});

const userSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  agents: [agentSchema],
  companyURI: { type: String, required: false }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
