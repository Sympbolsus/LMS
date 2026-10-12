'use client';

import { useState } from 'react';
// axios အစား ကျွန်တော်တို့ဖန်တီးထားတဲ့ axiosClient ကို import လုပ်ပါမယ်
import axiosClient from '@/api/axiosClient';// URL အပြည့်အစုံနဲ့ Header တွေ ထည့်ပေးစရာ မလိုတော့ပါဘူး
const response = await axiosClient.post('/courses', formData);
import { useRouter } from 'next/navigation';

export default function CreateCoursePage() {
  const router = useRouter();
  
  // State ဖြင့် Form Data များကို ထိန်းချုပ်ခြင်း
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    thumbnail: '',
    isPublished: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Input Field များ ပြောင်းလဲပါက State တွင် Update လုပ်ခြင်း
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Form Submit လုပ်သည့်အခါ အလုပ်လုပ်မည့် Function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. localStorage မှ Admin ၏ Token ကို ဆွဲယူခြင်း
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Login ပြန်ဝင်ပေးပါရန်။ Token မရှိပါ။');
        setLoading(false);
        return;
      }

// URL အပြည့်အစုံနဲ့ Header တွေ ထည့်ပေးစရာ မလိုတော့ပါဘူး
const response = await axiosClient.post('/courses', formData);

      alert('Course အသစ် ဖန်တီးခြင်း အောင်မြင်ပါသည်!');
      console.log('Created Course:', response.data);

      // Course ဖန်တီးပြီးပါက Course List စာမျက်နှာသို့ ပြန်ညွှန်းခြင်း
      router.push('/admin/courses');

    } catch (err) {
      console.error('Error creating course:', err);
      // Backend မှ ပြန်လာသော Error Message ကို ပြသခြင်း
      setError(
        err.response?.data?.message || 'Course ဖန်တီးရာတွင် အမှားတစ်ခု ရှိနေပါသည်။'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Course အသစ် ဖန်တီးရန် (Admin)</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Course ခေါင်းစဉ်:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>အကြောင်းအရာ (Description):</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>ဈေးနှုန်း (ကျပ် / USD):</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Thumbnail Image URL:</label>
          <input
            type="text"
            name="thumbnail"
            placeholder="https://example.com/image.jpg"
            value={formData.thumbnail}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
            />
            {' '}ချက်ချင်း Publish လုပ်မည်
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'ဖန်တီးနေပါသည်...' : 'Course ဖန်တီးမည်'}
        </button>
      </form>
    </div>
  );
}