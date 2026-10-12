const Course = require('../models/Course'); // Course Schema ကို ခေါ်ယူခြင်း

// Admin မှ Course အသစ် ဖန်တီးရန် (Create Course)
const createCourse = async (req, res) => {
  try {
    const { title, description, price, thumbnail, isPublished } = req.body;

    // လိုအပ်တဲ့ အချက်အလက်တွေ အကုန်ပါ/မပါ စစ်ဆေးခြင်း
    if (!title || !description) {
      return res.status(400).json({ message: "Course ခေါင်းစဉ်နှင့် အကြောင်းအရာ ထည့်သွင်းရန် လိုအပ်ပါသည်။" });
    }

    // req.user က verifyToken middleware ကနေ ဝင်လာမယ့် (လက်ရှိ login ဝင်ထားတဲ့ Admin) ရဲ့ Data ပါ
    const instructorId = req.user.id; 

    // Database ထဲသို့ Course အသစ် သိမ်းဆည်းခြင်း
    const newCourse = new Course({
      title,
      description,
      price: price || 0,
      thumbnail: thumbnail || 'default-course.jpg',
      instructor: instructorId,
      isPublished: isPublished || false,
    });

    const savedCourse = await newCourse.save(); // DB ထဲ သိမ်းခြင်း

    // အောင်မြင်ကြောင်း Frontend ကို ပြန်ပို့ခြင်း
    res.status(201).json({
      message: "Course အသစ် ဖန်တီးခြင်း အောင်မြင်ပါသည်!",
      course: savedCourse
    });

  } catch (error) {
    console.error("Course ဖန်တီးရာတွင် အမှားရှိနေပါသည်:", error);
    res.status(500).json({ error: error.message });
  }
};
const getAllCourses = async (req, res) => {
  try {
    // Database ထဲရှိ Course အားလုံးကို ရှာမည် (Instructor ရဲ့ id အစား name ကို အစားထိုးယူမည်)
    const courses = await Course.find()
      .populate('instructor', 'name email') // User Model မှ နာမည်နှင့် email ကို ယူမည်
      .sort({ createdAt: -1 }); // နောက်ဆုံး ဖန်တီးထားသော Course ကို အပေါ်ဆုံးမှာ ပြရန်

    res.status(200).json(courses);
  } catch (error) {
    console.error("Course များ ဆွဲထုတ်ရာတွင် အမှားရှိနေပါသည်:", error);
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  createCourse,
  getAllCourses
};