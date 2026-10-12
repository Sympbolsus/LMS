// backend/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// အကောင့်သစ်ဖွင့်ရန် (Register)
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Email ထပ်နေ/မနေ စစ်ဆေးခြင်း
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "ဒီ Email ဖြင့် အကောင့်ဖွင့်ထားပြီး ဖြစ်ပါသည်။" });
    }

    // Password ကို ဖျောက်ရန် (Hash)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Database ထဲ သိမ်းရန် User အသစ်ဖန်တီးခြင်း
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'student' // Role မပါရင် Student ဟု သတ်မှတ်မည်
    });

    await newUser.save();
    res.status(201).json({ message: "အကောင့်ဖွင့်ခြင်း အောင်မြင်ပါသည်" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// စနစ်ထဲဝင်ရန် (Login)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // User ကို Email ဖြင့် ရှာခြင်း
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email သို့မဟုတ် Password မှားယွင်းနေပါသည်။" });
    }

    // Password မှန်/မမှန် တိုက်စစ်ခြင်း
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Email သို့မဟုတ် Password မှားယွင်းနေပါသည်။" });
    }

    // Token ဖန်တီးခြင်း (၁ ရက် သက်တမ်း)
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    // Frontend ကို Token နှင့် အချက်အလက်များ ပြန်ပို့ပေးခြင်း
    res.status(200).json({
      message: "Login အောင်မြင်ပါသည်",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Profile ယူရန် (စောစောက ရေးခဲ့သည့် အပိုင်း)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: "User ရှာမတွေ့ပါ" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login, getUserProfile };