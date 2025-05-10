const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Model
const Question = mongoose.model('Question', new mongoose.Schema({
  title: String,
  description: String,
  solutions: [String]
}));

// Routes
app.get('/questions', async (req, res) => {
  try {
    const questions = await Question.find();
    console.log(questions);  // Log the questions to check if they are being fetched
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching questions', error: err });
  }
});


app.post('/questions', async (req, res) => {
  const { title, description, solutions } = req.body;
  const question = new Question({ title, description, solutions });
  await question.save();
  res.status(201).json(question);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
