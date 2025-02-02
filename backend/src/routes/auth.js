const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

//Signup
router.post('/signup', async (req, res) => {
    try {
        const { companyName, email, phoneNumber, password } = req.body;

        if (!companyName || !email || !phoneNumber || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const agents = [];
        const companyURI = "";
        const newUser = new User({ companyName, email, phoneNumber, password: hashedPassword, agents, companyURI });
        await newUser.save();

        res.status(201).json({ message: 'Account successfully registered.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Login
router.post('/login', async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const tokenExpiry = rememberMe ? '7d' : '1h';

        const token = jwt.sign(
            { userId: user._id, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: tokenExpiry }
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;