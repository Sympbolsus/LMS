const Course = require('../models/Course'); // Course Model
const Lesson = require('../models/Lesson'); // Lesson Model

// GET /api/progress/dashboard
// ကျောင်းသား၏ Course အလိုက် Progress ရာခိုင်နှုန်းများကို ယူမည်
router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) return res.status(404).json({ message: "User ရှာမတွေ့ပါ" });

    // Course အားလုံးနှင့် Lesson အားလုံးကို ဆွဲထုတ်မည် 
    // (အမှန်တကယ် လုပ်ငန်းခွင်တွင် ကျောင်းသား Enroll လုပ်ထားသော Course များကိုသာ ဆွဲထုတ်ပါမည်)
    const courses = await Course.find();
    const lessons = await Lesson.find();

    // Course တစ်ခုချင်းစီအတွက် Progress တွက်ချက်ခြင်း
    const dashboardData = courses.map(course => {
      // ဒီ Course အောက်မှာရှိတဲ့ Lesson များကို စစ်ထုတ်ခြင်း
      const courseLessons = lessons.filter(l => l.course.toString() === course._id.toString());
      const totalLessons = courseLessons.length;

      // ကျောင်းသား ပြီးမြောက်ထားသော (completed) Lesson အရေအတွက်ကို ရှာခြင်း
      const completedLessons = courseLessons.filter(lesson => {
        const userProgress = user.progress.find(p => p.lessonId.toString() === lesson._id.toString());
        return userProgress && userProgress.status === 'completed';
      }).length;

      // ရာခိုင်နှုန်း တွက်ချက်ခြင်း (သင်ခန်းစာ မရှိသေးပါက 0% ဟု သတ်မှတ်မည်)
      const progressPercentage = totalLessons === 0 
        ? 0 
        : Math.round((completedLessons / totalLessons) * 100);

      return {
        courseId: course._id,
        title: course.title,
        totalLessons,
        completedLessons,
        progressPercentage
      };
    });

    res.json(dashboardData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});