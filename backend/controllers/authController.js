const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Category = require('../models/Category');


exports.registerUser = async (req, res) => {
    const { name, email, password, country, income_bracket } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            password: hashedPassword,
            country,
            income_bracket
        });

        await user.save();

        // create default expense categories for new user
        const defaultCats = [
            { name: 'Business Expenses', type: 'expense', color: '#6366f1' },
            { name: 'Office Rent', type: 'expense', color: '#8b5cf6' },
            { name: 'Software Subscriptions', type: 'expense', color: '#ec4899' },
            { name: 'Professional Development', type: 'expense', color: '#f43f5e' },
            { name: 'Marketing', type: 'expense', color: '#f97316' },
            { name: 'Travel', type: 'expense', color: '#22c55e' },
            { name: 'Meals & Entertainment', type: 'expense', color: '#14b8a6' },
            { name: 'Utilities', type: 'expense', color: '#3b82f6' },
        ];
        await Category.insertMany(defaultCats.map(c => ({ ...c, user: user.id })));

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const payload = { user: { id: user.id } };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE },
            (err, token) => {
                if (err) throw err;
                res.json({
                    message: "Login successful",
                    token,
                    user: { name: user.name, email: user.email, country: user.country, income_bracket: user.income_bracket }
                });
            }
        );

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};