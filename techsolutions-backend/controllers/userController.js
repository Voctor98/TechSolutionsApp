const User = require('../models/User');

exports.createUser = (req, res) => {
    const { username, email, password } = req.body;

    User.create(username, email, password, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'User created', userId: results.insertId });
    });
};

exports.getUserByEmail = (req, res) => {
    const { email } = req.params;

    User.findByEmail(email, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(results[0]);
    });
};

exports.getAllUsers = (req, res) => {
    User.findAll((err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
};

exports.updateUser = (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;

    User.update(id, username, email, password, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'User updated' });
    });
};

exports.deleteUser = (req, res) => {
    const { id } = req.params;

    User.delete(id, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'User deleted' });
    });
};