require('dotenv').config(); // .env ဖိုင်ထဲက Data များကို ဖတ်ရန်
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Database ချိတ်ဆက်မည့် ဖိုင်

// Route ဖိုင်များကို ခေါ်ယူခြင်း
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const progressRoutes = require('./routes/progressRoutes');

// Express App တည်ဆောက်ခြင်း
const app = express();

// Middleware များ အသုံးပြုခြင်း
app.use(cors()); // Frontend (Next.js) မှ လှမ်းခေါ်ခွင့်ပြုရန်
app.use(express.json()); // Request Body မှ JSON Data များကို ဖတ်နိုင်ရန်

// MongoDB သို့ ချိတ်ဆက်ခြင်း (config/db.js မှ connectDB function ကို ခေါ်သုံးသည်)
connectDB();

// --------------------------------------------------------
// API လမ်းကြောင်းများ (Routes) သတ်မှတ်ခြင်း
// --------------------------------------------------------

// ၁။ Login & Register အတွက်
app.use('/api/auth', authRoutes); 

// ၂။ User Profile အတွက် 
// (မှတ်ချက် - getUserProfile ကို authRoutes ထဲမှာပဲ ရေးခဲ့တဲ့အတွက် အလွယ်တကူ ဒီလို ထပ်ချိတ်ပေးလို့ ရပါတယ်)
app.use('/api/users', authRoutes); 

// ၃။ Course များ (Admin မှ ဖန်တီးရန် နှင့် ကျောင်းသားများ ကြည့်ရန်)
app.use('/api/courses', courseRoutes);

// ၄။ Lesson များ (YouTube Video များ ထည့်ရန်)
app.use('/api/lessons', lessonRoutes);

// ၅။ ကျောင်းသား Video ကြည့်ချိန် (Heartbeat) နှင့် Dashboard အတွက်
app.use('/api/progress', progressRoutes);

// --------------------------------------------------------

// Base URL (Backend အလုပ်လုပ်/မလုပ် စမ်းသပ်ရန်)
app.get('/', (req, res) => {
  res.send('LMS API Server is running successfully! 🚀');
});

// Port သတ်မှတ်ခြင်း နှင့် Server စတင်ခြင်း
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});