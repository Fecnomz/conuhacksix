const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const authMiddleware = require('../middleware/auth')

router.post('/signup', async (req, res) => {
  try {
    const { companyName, email, phoneNumber, password, agents, companyURI, companyDescription } = req.body
    if (!companyName || !email || !phoneNumber || !password) {
      return res.status(400).json({ message: 'companyName, email, phoneNumber, and password are required.' })
    }
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({ companyName, email, phoneNumber, password: hashedPassword, agents: agents || [], companyURI: companyURI || '', companyDescription: companyDescription || '' })
    const token = jwt.sign({ userId: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '7d' })
    req.session.user = { id: newUser._id, email: newUser.email }
    res.status(201).json({ message: 'Signup successful', token })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' })
    }
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' })
    }
    const tokenExpiry = rememberMe ? '7d' : '1h'
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: tokenExpiry })
    req.session.user = { id: user._id, email: user.email }
    res.status(200).json({ message: 'Login successful', token })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out. Please try again.' })
    }
    res.clearCookie('connect.sid')
    res.status(200).json({ message: 'Logout successful' })
  })
})

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.session && req.session.user ? req.session.user.id : req.user.userId
    const user = await User.findById(userId).lean()
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }
    res.status(200).json({ user: {
      _id: user._id,
      companyName: user.companyName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      agents: user.agents,
      companyURI: user.companyURI,
      companyDescription: user.companyDescription
    }})
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/agents/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.session && req.session.user ? req.session.user.id : req.user.userId;
    const user = await User.findById(userId).lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const agent = user.agents.find(agent => agent._id.toString() === req.params.id);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found.' });
    }

    res.status(200).json(agent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  
});router.get('/company-info', authMiddleware, async (req, res) => {
  try {
    const userId = req.session?.user?.id || req.user?.userId;
    const user = await User.findById(userId).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      companyName: user.companyName,
      phoneNumber: user.phoneNumber,
      companyURI: user.companyURI || "",
      companyDescription: user.companyDescription || "",
    });
  } catch (error) {
    console.error("Error fetching company info:", error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/company-info', authMiddleware, async (req, res) => {
  try {
    const userId = req.session?.user?.id || req.user?.userId;
    const { companyName, phoneNumber, companyURI, companyDescription } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { companyName, phoneNumber, companyURI, companyDescription },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "Company info updated successfully." });
  } catch (error) {
    console.error("Error updating company info:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router
