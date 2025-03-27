const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const bcrypt = require('bcryptjs');

// Регистрация
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    const token = jwt.sign({ id: user.id }, 'your_jwt_secret');
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Логин
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).send({ error: 'Login failed' });
    }

    const isPasswordMatch = await user.validPassword(password);

    if (!isPasswordMatch) {
      return res.status(401).send({ error: 'Login failed' });
    }

    const token = jwt.sign({ id: user.id }, 'your_jwt_secret');
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;