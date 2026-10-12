'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axiosClient from '@/api/axiosClient';

export default function RegisterPage() {
  const router = useRouter();

  // Form အချက်အလက်များ သိမ်းဆည်းရန် State များ
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Input Box တွေမှာ စာရိုက်လိုက်တိုင်း State ကို Update လုပ်မည့် Function
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Backend သို့ အချက်အလက်များ ပို့ခြင်း
      // Role ကို မပို့ပါက Backend မှ အလိုအလျောက် 'student' ဟု သတ်မှတ်ပေးမည်ဖြစ်သည်
      await axiosClient.post('/auth/register', formData);

      alert('အကောင့်ဖွင့်ခြင်း အောင်မြင်ပါသည်! ကျေးဇူးပြု၍ Login ပြန်ဝင်ပါ။');
      
      // အကောင့်ဖွင့်ပြီးပါက Login Page သို့ အလိုအလျောက် ပို့ပေးမည်
      router.push('/login');
      
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'အကောင့်ဖွင့်ရာတွင် အမှားရှိနေပါသည်။');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '30px', border: '1px solid #ccc', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>အကောင့်သစ်ဖွင့်ရန် (Register)</h2>
      
      {error && (
        <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>အမည် (Name):</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            placeholder="Mg Mg"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>အီးမေးလ် (Email):</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            placeholder="student@example.com"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>စကားဝှက် (Password):</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
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
            backgroundColor: loading ? '#ccc' : '#28a745', // အကောင့်ဖွင့်တာဖြစ်လို့ အစိမ်းရောင် သုံးထားပါတယ်
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'အကောင့်ဖွင့်နေပါသည်...' : 'အကောင့်ဖွင့်မည်'}
        </button>
      </form>

      {/* Login စာမျက်နှာသို့ သွားရန် လင့်ခ် */}
      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
        အကောင့်ရှိပြီးသားလား?{' '}
        <Link href="/login" style={{ color: '#0070f3', textDecoration: 'none' }}>
          Login ဝင်ရန်
        </Link>
      </div>
    </div>
  );
}