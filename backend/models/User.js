// models/User.js
const mongoose = require('mongoose');

// ၁။ Lesson တစ်ခုချင်းစီရဲ့ Progress ကို သိမ်းမယ့် Sub-schema
const progressSchema = new mongoose.Schema({
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson', // Lesson Model နှင့် ချိတ်ဆက်ထားသည်
    required: true
  },
  watchTime: {
    type: Number,
    default: 0 // ကြည့်ခဲ့သည့် စုစုပေါင်း ကြာချိန် (စက္ကန့်ဖြင့်)
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed'],
    default: 'in-progress'
  },
  completedAt: {
    type: Date
  }
});

// ၂။ အဓိက User Schema (Student နှင့် Admin နှစ်ခုလုံးအတွက်)
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'နာမည် ထည့်ရန် လိုအပ်ပါသည်'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email ထည့်ရန် လိုအပ်ပါသည်'],
    unique: true, // Email ထပ်နေရင် DB က လက်မခံပါ
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password ထည့်ရန် လိုအပ်ပါသည်'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student' // အလိုအလျောက် Student ဟု သတ်မှတ်မည်
  },

  // ကျောင်းသား ယူထားသည့် ဘာသာရပ်များ (Python, Cybersecurity စသည်)
  enrolledCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course' // Course Model နှင့် ချိတ်ဆက်ထားသည်
    }
  ],

  // ကျောင်းသား၏ စာလုပ်မှတ်တမ်း (Progress Sub-schema ကို ပြန်သုံးထားသည်)
  progress: [progressSchema],

  // နောက်ဆုံး စနစ်ထဲ ဝင်ခဲ့/စာလုပ်ခဲ့သည့် အချိန် (Last Active Date)
  lastActiveDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // createdAt (အကောင့်စဖွင့်ချိန်) နှင့် updatedAt ကို အလိုအလျောက် ထည့်ပေးပါမည်
});
// ... အခြား Schema များ ...

  // နေ့စဉ် စာလုပ်သည့် မှတ်တမ်း
  dailyStudyLogs: [
    {
      date: { type: String }, // ဥပမာ - "2026-08-18" 
      watchTime: { type: Number, default: 0 } // ထိုနေ့အတွက် ကြည့်ခဲ့သည့် စက္ကန့်
    }
  ],
module.exports = mongoose.model('User', userSchema);