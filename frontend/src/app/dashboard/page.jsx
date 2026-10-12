'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axiosClient from '@/api/axiosClient';

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedTag, setSelectedTag] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. User Token နှင့် အချက်အလက်များ စစ်ဆေးခြင်း
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token) {
      router.push('/login');
      return;
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // 2. Course အားလုံးကို ဆွဲယူခြင်း
    const fetchCourses = async () => {
      try {
        const res = await axiosClient.get('/courses');
        setCourses(res.data);
      } catch (err) {
        console.error('Course များ ရယူ၍ မရပါ:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [router]);

  // Tag အလိုက် Course များကို Filter လုပ်ခြင်း
  const filteredCourses = selectedTag === 'All'
    ? courses
    : courses.filter(course => course.tags && course.tags.includes(selectedTag));

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Dashboard...</div>;
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '30px auto', padding: '0 20px' }}>
      
      {/* 1. User Header & Profile Info */}
      <div style={{ backgroundColor: '#1e293b', color: 'white', padding: '25px', borderRadius: '12px', marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 10px 0' }}>မင်္ဂလာပါ, {user?.name || 'Student'} 👋</h2>
        <p style={{ margin: '0 0 15px 0', opacity: 0.8 }}>သင်ယူလေ့လာဖို့ ပြင်ဆင်လိုက်ရအောင်။</p>
        
        {/* User ၏ Roles / Interests များကို Badge အနေဖြင့် ပြသခြင်း */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', opacity: '0.9' }}>စိတ်ပါဝင်စားသည့် Role များ:</span>
          {user?.interests && user.interests.length > 0 ? (
            user.interests.map((interest, idx) => (
              <span key={idx} style={{ backgroundColor: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' }}>
                {interest}
              </span>
            ))
          ) : (
            <span style={{ fontSize: '12px', color: '#cbd5e1' }}>Role မရွေးရသေးပါ</span>
          )}
        </div>
      </div>

      {/* 2. Filter Buttons */}
      <div style={{ marginBottom: '25px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setSelectedTag('All')}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: selectedTag === 'All' ? '#0070f3' : '#e2e8f0',
            color: selectedTag === 'All' ? 'white' : '#333',
            cursor: 'pointer'
          }}
        >
          All Courses
        </button>
        {['JavaScript', 'Python', 'React', 'Node.js'].map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: selectedTag === tag ? '#0070f3' : '#e2e8f0',
              color: selectedTag === tag ? 'white' : '#333',
              cursor: 'pointer'
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* 3. Courses Grid List */}
      <h3 style={{ marginBottom: '20px' }}>သင်ခန်းစာများ ({filteredCourses.length})</h3>

      {filteredCourses.length === 0 ? (
        <p style={{ color: '#666' }}>မည်သည့် Course မှ မရှိသေးပါ။</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {filteredCourses.map((course) => (
            <div
              key={course._id}
              style={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <div>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#0f172a' }}>{course.title}</h4>
                <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.5', margin: '0 0 15px 0' }}>
                  {course.description || 'သင်ခန်းစာ အသေးစိတ် မရှိပါ။'}
                </p>
              </div>

              <Link
                href={`/courses/${course._id}`}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  backgroundColor: '#0070f3',
                  color: 'white',
                  padding: '10px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  marginTop: '10px'
                }}
              >
                သင်ခန်းစာ ကြည့်မည် &rarr;
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}