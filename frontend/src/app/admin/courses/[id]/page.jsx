'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import axiosClient from '@/api/axiosClient';

export default function CourseLessons() {
  const router = useRouter();
  const params = useParams(); // URL ထဲမှ [id] ကို ယူရန်
  const courseId = params.id; 

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lesson အသစ်ထည့်ရန် State များ
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [duration, setDuration] = useState(''); // စက္ကန့်ဖြင့်
  const [order, setOrder] = useState(1);
  const [creating, setCreating] = useState(false);

  // Course အချက်အလက်နှင့် ၎င်း၏ Lesson များကို ဆွဲယူခြင်း
  const fetchData = async () => {
    try {
      // Course အချက်အလက် ယူရန် (ဒီ API Backend မှာ ရှိရန်လိုအပ်သည်)
      const courseRes = await axiosClient.get(`/courses/${courseId}`);
      setCourse(courseRes.data);

      // Lesson များယူရန် (Lesson အားလုံးထဲမှ ဒီ Course အတွက်ပဲ စစ်ထုတ်မည်)
      const lessonRes = await axiosClient.get('/lessons');
      const courseLessons = lessonRes.data.filter(l => l.course === courseId || l.course?._id === courseId);
      
      // Order အစဉ်လိုက် စီစဉ်မည်
      courseLessons.sort((a, b) => a.order - b.order);
      setLessons(courseLessons);
      
      // နောက်ထပ်ထည့်မည့် Lesson အတွက် Order နံပါတ် အလိုအလျောက် တိုးပေးမည်
      setOrder(courseLessons.length + 1);

    } catch (error) {
      console.error("Data ယူရာတွင် အမှားရှိပါသည်", error);
      alert("အချက်အလက်များ မရယူနိုင်ပါ။");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      alert("Admin access required.");
      router.push('/');
    } else {
      fetchData();
    }
  }, [courseId]);

  // Lesson အသစ် ပေါင်းထည့်ခြင်း
  const handleAddLesson = async (e) => {
    e.preventDefault();
    if (!title || !videoUrl || !duration) return alert("အချက်အလက်များ ပြည့်စုံစွာ ဖြည့်ပါ။");

    setCreating(true);
    try {
      await axiosClient.post('/lessons', {
        course: courseId,
        title,
        videoUrl, // ဥပမာ - https://www.youtube.com/watch?v=...
        duration: Number(duration), // String မှ Number သို့ ပြောင်းခြင်း
        order: Number(order)
      });

      alert('သင်ခန်းစာအသစ် ထည့်သွင်းမှု အောင်မြင်ပါသည်!');
      setTitle('');
      setVideoUrl('');
      setDuration('');
      
      // Lesson စာရင်းကို အသစ်ပြန်ခေါ်မည်
      fetchData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Lesson ထည့်ရာတွင် အမှားရှိနေပါသည်။');
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading Course & Lessons...</div>;
  if (!course) return <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>Course ရှာမတွေ့ပါ။</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px' }}>
      
      <Link href="/admin/courses" style={{ color: '#0070f3', textDecoration: 'none', marginBottom: '20px', display: 'inline-block' }}>
        &larr; Admin Panel (Course List) သို့ ပြန်သွားမည်
      </Link>

      <div style={{ backgroundColor: '#0070f3', color: 'white', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 10px 0' }}>{course.title}</h2>
        <p style={{ margin: 0, opacity: 0.9 }}>{course.description}</p>
      </div>

      {/* Lesson အသစ်ထည့်ရန် Form */}
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h3>သင်ခန်းစာအသစ် ထည့်ရန် (Add New Lesson)</h3>
        <form onSubmit={handleAddLesson} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
          
          <div style={{ gridColumn: '1 / span 2' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>သင်ခန်းစာ ခေါင်းစဉ်:</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} placeholder="ဥပမာ - React အခြေခံ" />
          </div>

          <div style={{ gridColumn: '1 / span 2' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>YouTube URL / Video Link:</label>
            <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} placeholder="https://www.youtube.com/watch?v=..." />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>ကြာချိန် (စက္ကန့်):</label>
            <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} placeholder="ဥပမာ - 600 (10 မိနစ်)" />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>အစဉ်လိုက် နံပါတ် (Order):</label>
            <input type="number" value={order} onChange={(e) => setOrder(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
          </div>

          <button type="submit" disabled={creating} style={{ gridColumn: '1 / span 2', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
            {creating ? 'Saving...' : 'Lesson ထည့်မည်'}
          </button>
        </form>
      </div>

      {/* ထည့်ပြီးသား Lesson များစာရင်း ပြသရန် */}
      <h3>ထည့်သွင်းထားသော သင်ခန်းစာများ ({lessons.length})</h3>
      {lessons.length === 0 ? (
        <p style={{ color: '#666' }}>သင်ခန်းစာများ မရှိသေးပါ။ အထက်ပါ Form တွင် စတင်ထည့်သွင်းပါ။</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
          {lessons.map((lesson) => (
            <div key={lesson._id} style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#0070f3', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginRight: '15px' }}>
                {lesson.order}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 5px 0' }}>{lesson.title}</h4>
                <div style={{ fontSize: '12px', color: '#666', display: 'flex', gap: '15px' }}>
                  <span>⏳ ကြာချိန်: {Math.floor(lesson.duration / 60)} မိနစ် {lesson.duration % 60} စက္ကန့်</span>
                  <a href={lesson.videoUrl} target="_blank" rel="noreferrer" style={{ color: '#0070f3', textDecoration: 'none' }}>▶️ YouTube တွင် ကြည့်ရန်</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
    </div>
  );
}