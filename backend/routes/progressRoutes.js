// backend/routes/progressRoutes.js
const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// (၁) ကျောင်းသား ဗီဒီယို ကြည့်နေစဉ် Progress အပ်ဒိတ်လုပ်ရန် (Student Only)
router.post('/update', verifyToken, async (req, res) => {
  try {
    const { lessonId, courseId, percentage } = req.body;
    const userId = req.user.id;

    let progress = await Progress.findOne({ user: userId, lesson: lessonId });

    if (progress) {
      // ပိုမြင့်သော ကြည့်ရှုပြီး ရာခိုင်နှုန်းကိုသာ အတည်ပြုသိမ်းဆည်းမည်
      if (percentage > progress.watchedPercentage) {
        progress.watchedPercentage = percentage;
        progress.isCompleted = percentage >= 90; // ၉၀% ကြည့်ပြီးပါက ပြီးမြောက်သည်ဟု သတ်မှတ်မည်
        await progress.save();
      }
    } else {
      progress = new Progress({
        user: userId,
        lesson: lessonId,
        course: courseId,
        watchedPercentage: percentage,
        isCompleted: percentage >= 90
      });
      await progress.save();
    }

    res.json({ message: "Progress ထိန်းသိမ်းပြီးပါပြီ", progress });
  } catch (err) {
    res.status(500).json({ message: "Progress အပ်ဒိတ်လုပ်၍ မရပါ", error: err.message });
  }
});

// (၂) Admin ဘက်မှ ကျောင်းသားအားလုံး၏ Progress များကို ကြည့်ရှုရန် (Admin Only)
router.get('/admin/all', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const allProgress = await Progress.find()
      .populate('user', 'name email')
      .populate('course', 'title')
      .populate('lesson', 'title');

    res.json(allProgress);
  } catch (err) {
    res.status(500).json({ message: "Progress များ ဆွဲယူ၍ မရပါ", error: err.message });
  }
});

module.exports = router;