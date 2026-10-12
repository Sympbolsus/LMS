'use client';

import { useState, useEffect } from 'react';
import axiosClient from '@/api/axiosClient';

// ဒီနေရာမှာ export default function လို့ မဖြစ်မနေ ပါရပါမယ်
export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Backend မှ ကျောင်းသား၏ Profile နှင့် နေ့စဉ်မှတ်တမ်းများကို ယူမည်
    const fetchProfile = async () => {
      try {
        const response = await axiosClient.get('/users/profile'); 
        setProfile(response.data);
      } catch (error) {
        console.error("Profile ယူရာတွင် အမှားရှိပါသည်", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // ယခုတစ်ပတ်၏ တနင်္လာ မှ တနင်္ဂနွေ အထိ ရက်စွဲများကို တွက်ချက်ခြင်း
  const getCurrentWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay() || 7; // တနင်္ဂနွေ(0) ကို 7 ဟုထားမည်
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek + 1);

    const weekDays = [];
    const dayNames = ['တနင်္လာ', 'အင်္ဂါ', 'ဗုဒ္ဓဟူး', 'ကြာသပတေး', 'သောကြာ', 'စနေ', 'တနင်္ဂနွေ'];

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      const dateString = date.toISOString().split('T')[0]; // "YYYY-MM-DD"
      
      weekDays.push({
        name: dayNames[i],
        dateString,
        isWeekend: i === 5 || i === 6 // စနေ၊ တနင်္ဂနွေ
      });
    }
    return weekDays;
  };

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading Profile...</div>;
  if (!profile) return <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>Profile မတွေ့ရှိပါ။ Login အရင်ဝင်ပါ။</div>;

  const currentWeek = getCurrentWeekDates();

  // ဒီနေရာမှာ UI (JSX) ကို return ပြန်ပေးရပါမယ်
  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#0070f3', color: '#fff', fontSize: '40px', lineHeight: '100px', margin: '0 auto' }}>
          {profile.name.charAt(0)}
        </div>
        <h2>{profile.name} ၏ Profile</h2>
        <p>{profile.email}</p>
      </div>

      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
        <h3 style={{ borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>ယခုတစ်ပတ် စာလုပ်မှု မှတ်တမ်း (Daily Tracking)</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', marginTop: '20px', textAlign: 'center' }}>
          {currentWeek.map((day, index) => {
            const studyLog = profile.dailyStudyLogs?.find(log => log.date === day.dateString);
            const studyMinutes = studyLog ? Math.floor(studyLog.watchTime / 60) : 0;
            const didStudy = studyMinutes > 0;

            return (
              <div key={index} style={{ 
                padding: '10px', 
                backgroundColor: day.isWeekend ? '#e0e0e0' : (didStudy ? '#d4edda' : '#f8d7da'),
                border: didStudy ? '2px solid #28a745' : '1px solid #ccc',
                borderRadius: '8px',
                opacity: day.isWeekend ? 0.7 : 1
              }}>
                <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '5px' }}>{day.name}</div>
                
                {day.isWeekend ? (
                  <span style={{ fontSize: '12px', color: '#666' }}>☕ နားရက်</span>
                ) : (
                  didStudy ? (
                    <div style={{ color: '#28a745', fontWeight: 'bold' }}>
                      ✓ <br/><span style={{ fontSize: '12px' }}>{studyMinutes} mins</span>
                    </div>
                  ) : (
                    <div style={{ color: '#dc3545', fontWeight: 'bold' }}>
                      ✗ <br/><span style={{ fontSize: '12px' }}>Missed</span>
                    </div>
                  )
                )}
              </div>
            );
          })}
        </div>
        <p style={{ fontSize: '14px', color: '#666', marginTop: '15px', textAlign: 'center' }}>
          * တစ်ပတ်လျှင် ၅ ရက် စာလုပ်ရန် လိုအပ်ပါသည်။ စနေ နှင့် တနင်္ဂနွေ သည် နားရက်ဖြစ်ပါသည်။
        </p>
      </div>
    </div>
  );
}