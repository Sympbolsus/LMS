// config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Mongoose ဖြင့် Database ကို ချိတ်ဆက်ခြင်း
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('GGGG');
  } catch (error) {
    console.error('❌ :', error.message);
    process.exit(1); // Error ဖြစ်လျှင် Process ကို ရပ်ပစ်မည်
  }
};

module.exports = connectDB;