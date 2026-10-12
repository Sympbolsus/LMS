'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosClient from '@/api/axiosClient'; // စောစောက ဖန်တီးထားသော axiosClient

export default function LoginPage() {
  const router = useRouter();
  
  // State များ သတ်မှတ်ခြင်း
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); // Form အလိုအလျောက် Refresh ဖြစ်ခြင်းကို တားဆီးရန်
    setError('');
    setLoading(true);

    try {
      // Backend သို့ Email နှင့် Password ပို့ခြင်း
      const response = await axiosClient.post('/auth/login', {
        email,
        password,
      });

      // Login အောင်မြင်ပါက Token နှင့် User Data ကို ရလာပါမည်
      const { token, user } = response.data;

      // Token ကို Browser ၏ localStorage တွင် သိမ်းမည် (နောင် API များ ခေါ်လျှင် သုံးရန်)
      localStorage.setItem('token', token);
      
      // User ၏ အခန်းကဏ္ဍ (Role) ကိုပါ သိမ်းထားနိုင်သည်
      localStorage.setItem('role', user.role);

      alert('Login ဝင်ခြင်း အောင်မြင်ပါသည်!');

      // Role ပေါ်မူတည်၍ သွားမည့် Page ကို ခွဲမည်
      if (user.role === 'admin') {
        router.push('/admin/courses'); // Admin ဆိုလျှင် Course စာရင်းသို့
      } else {
        router.push('/profile'); // ကျောင်းသားဆိုလျှင် Profile သို့
      }

    } catch (err) {
      // Backend မှ Error ပြန်လာပါက ပြသရန်
      console.error(err);
      setError(err.response?.data?.message || 'Login ဝင်ရာတွင် အမှားရှိနေပါသည်။');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '30px', border: '1px solid #ccc', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>စနစ်သို့ ဝင်ရန် (Login)</h2>
      
      {error && (
        <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>အီးမေးလ် (Email):</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            placeholder="student@example.com"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>စကားဝှက် (Password):</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            placeholder="********"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading ? '#ccc' : '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'ဝင်ရောက်နေပါသည်...' : 'Login ဝင်မည်'}
        </button>
      </form>
    </div>
  );
}