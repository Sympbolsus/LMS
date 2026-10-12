// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

// Token မှန်/မမှန် စစ်ဆေးခြင်း (Student နှင့် Admin နှစ်ခုလုံးအတွက်)
const verifyToken = (req, res, next) => {
  try {
    // Header ထဲကနေ Authorization ကို ယူပါမယ် (ပုံစံ: "Bearer eyJhbG...")
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "ဝင်ခွင့်မရှိပါ။ Token လိုအပ်ပါသည်။" });
    }

    const token = authHeader.split(' ')[1]; // "Bearer" ကို ဖြုတ်ပြီး Token အစစ်ကို ယူခြင်း

    // Token ကို စစ်ဆေးခြင်း
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ပြီးရင် req.user ထဲမှာ id နဲ့ role ကို ထည့်ပေးလိုက်ပါမယ်
    next(); // ရှေ့ဆက်သွားခွင့်ပြုမည်

  } catch (error) {
    return res.status(403).json({ message: "Token မှားယွင်းနေပါသည် သို့မဟုတ် သက်တမ်းကုန်သွားပါပြီ။" });
  }
};

// Admin ဟုတ်/မဟုတ် စစ်ဆေးခြင်း
const verifyAdmin = (req, res, next) => {
  // verifyToken အရင်အလုပ်လုပ်ထားလို့ req.user ထဲမှာ Data ရောက်နေပါပြီ
  if (req.user && req.user.role === 'admin') {
    next(); // Admin ဖြစ်ရင် ရှေ့ဆက်သွားခွင့်ပြုမည်
  } else {
    return res.status(403).json({ message: "Admin သာလျှင် လုပ်ဆောင်ခွင့် ရှိပါသည်။" });
  }
};

module.exports = { verifyToken, verifyAdmin };