import axios from 'axios';

// ၁။ Axios Instance အသစ်တစ်ခု ဖန်တီးခြင်း
const axiosClient = axios.create({
  baseURL: 'http://localhost:5000/api', // Backend ရဲ့ အဓိက URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// ၂။ Request Interceptor (API မခေါ်ခင် ကြားဖြတ်လုပ်ဆောင်မည့်အပိုင်း)
axiosClient.interceptors.request.use(
  (config) => {
    // Next.js မှာ localStorage သုံးရင် Browser ဟုတ်မဟုတ် အရင်စစ်တာ အကောင်းဆုံးပါ
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      
      // Token ရှိနေရင် Header မှာ အလိုအလျောက် ထည့်ပေးမယ်
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ၃။ Response Interceptor (Backend က Data ပြန်အပို့တွင် ကြားဖြတ်လုပ်ဆောင်မည့်အပိုင်း)
axiosClient.interceptors.response.use(
  (response) => {
    // Data အောင်မြင်စွာ ပြန်လာလျှင်
    return response;
  },
  (error) => {
    // အကယ်၍ Token သက်တမ်းကုန်သွားလျှင် သို့မဟုတ် ဝင်ခွင့်မရှိလျှင် (401, 403 Errors)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error("Token သက်တမ်းကုန်သွားပါပြီ။ ကျေးဇူးပြု၍ Login ပြန်ဝင်ပါ။");
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token'); // Token အဟောင်းကို ဖျက်ပစ်မယ်
        localStorage.removeItem('role');
        
        // အလိုအလျောက် Login Page သို့ ပို့ပေးမည် (လက်ရှိ Page မဟုတ်လျှင်)
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;