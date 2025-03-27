const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { Todo } = require('../models');

// Создать todo
router.post('/', auth, async (req, res) => {
  try {
    const todo = await Todo.create({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).send(todo);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Получить все todos пользователя
router.get('/', auth, async (req, res) => {
  try {
    const todos = await Todo.findAll({ where: { userId: req.user.id } });
    res.send(todos);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Обновить todo
router.patch('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!todo) {
      return res.status(404).send();
    }

    await todo.update(req.body);
    res.send(todo);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Удалить todo
router.delete('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!todo) {
      return res.status(404).send();
    }

    await todo.destroy();
    res.send(todo);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;