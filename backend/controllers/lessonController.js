const Lesson = require('../models/Lesson');

// Admin မှ Course တစ်ခုအတွင်းသို့ Lesson အသစ် ထည့်သွင်းရန်
const createLesson = async (req, res) => {
  try {
    const { title, content, videoUrl, duration, lessonNumber, courseId } = req.body;

    // မဖြစ်မနေ လိုအပ်သော အချက်အလက်များ စစ်ဆေးခြင်း
    if (!title || !lessonNumber || !courseId) {
      return res.status(400).json({ message: "ခေါင်းစဉ်၊ Lesson နံပါတ် နှင့် Course ID တို့ လိုအပ်ပါသည်။" });
    }

    // Database ထဲသို့ Lesson အသစ် သိမ်းဆည်းခြင်း
    const newLesson = new Lesson({
      title,
      content,
      videoUrl, // ဥပမာ - YouTube Link
      duration: duration || 0,
      lessonNumber,
      course: courseId // ဘယ် Course အောက်မှာလဲဆိုတာကို ဒီ ID နဲ့ ချိတ်ဆက်ပါမယ်
    });

    const savedLesson = await newLesson.save();

    res.status(201).json({
      message: "သင်ခန်းစာ အသစ် ထည့်သွင်းခြင်း အောင်မြင်ပါသည်!",
      lesson: savedLesson
    });
  } catch (error) {
    console.error("Lesson ဖန်တီးရာတွင် အမှားရှိနေပါသည်:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createLesson
};