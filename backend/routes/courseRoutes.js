// backend/routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// (၁) Course အားလုံးကို ဆွဲယူရန် (GET http://localhost:5000/api/courses)
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Course များ ရယူ၍ မရပါ", error: err.message });
  }
});

// (၂) Course တစ်ခုတည်းကို ID ဖြင့် ရှာယူရန် (GET http://localhost:5000/api/courses/:id)
// *** ဒီ Endpoint မပါရင် Admin/Student Detail စာမျက်နှာမှာ Course ရှာမတွေ့ပါ ဟု ပြပါမည် ***
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course ရှာမတွေ့ပါ" });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Course မရယူနိုင်ပါ", error: err.message });
  }
});

// (၃) Course အသစ် ဖန်တီးရန် (POST http://localhost:5000/api/courses)
// Admin သာ ဖန်တီးခွင့်ရှိရန် verifyToken နှင့် verifyAdmin ခံထားသည်
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Course ခေါင်းစဉ် ရေးရန် လိုအပ်ပါသည်" });
    }

    const newCourse = new Course({
      title,
      description
    });

    await newCourse.save();
    res.status(201).json({ message: "Course အသစ် ဖန်တီးမှု အောင်မြင်ပါသည်", course: newCourse });
  } catch (err) {
    res.status(500).json({ message: "Course ဖန်တီးရာတွင် အမှားဖြစ်ပွားပါသည်", error: err.message });
  }
});

module.exports = router;