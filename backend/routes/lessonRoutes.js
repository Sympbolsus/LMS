// backend/routes/lessonRoutes.js
const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// (၁) Lesson အားလုံးကို ဆွဲယူရန် (GET http://localhost:5000/api/lessons)
router.get('/', async (req, res) => {
  try {
    const lessons = await Lesson.find();
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: "Lesson များ ရယူ၍ မရပါ", error: err.message });
  }
});

// (၂) Course ID တစ်ခုအောက်ရှိ Lesson များကို အစဉ်လိုက် (Order) ဆွဲယူရန်
router.get('/course/:courseId', async (req, res) => {
  try {
    const lessons = await Lesson.find({ course: req.params.courseId }).sort({ order: 1 });
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: "Lesson များ ရယူ၍ မရပါ", error: err.message });
  }
});

// (၃) Lesson အသစ် ထည့်သွင်းရန် (POST http://localhost:5000/api/lessons)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { course, title, videoUrl, duration, order } = req.body;

    if (!course || !title || !videoUrl || !duration) {
      return res.status(400).json({ message: "အချက်အလက်များ ပြည့်စုံစွာ ဖြည့်စွက်ပါ" });
    }

    const newLesson = new Lesson({
      course,
      title,
      videoUrl,
      duration: Number(duration),
      order: Number(order) || 1
    });

    await newLesson.save();
    res.status(201).json({ message: "Lesson အသစ် ထည့်သွင်းမှု အောင်မြင်ပါသည်", lesson: newLesson });
  } catch (err) {
    res.status(500).json({ message: "Lesson ဖန်တီးရာတွင် အမှားဖြစ်ပွားပါသည်", error: err.message });
  }
});

module.exports = router;