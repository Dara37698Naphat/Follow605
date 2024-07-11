const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/tasktracker', { useNewUrlParser: true, useUnifiedTopology: true });

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: String,
  created_at: { type: Date, default: Date.now }
});

const Task = mongoose.model('Task', taskSchema);

// สร้างงานใหม่
app.post('/tasks', async (req, res) => {
  const { title, description, status } = req.body;
  const newTask = new Task({ title, description, status });
  await newTask.save();
  res.send(newTask);
});

// ดึงงานทั้งหมด
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.send(tasks);
});

// อัพเดทงาน
app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  const updatedTask = await Task.findByIdAndUpdate(id, { title, description, status }, { new: true });
  res.send(updatedTask);
});

// ลบงาน
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  await Task.findByIdAndDelete(id);
  res.send({ message: 'Task deleted' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
