'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import ReactPlayer from 'react-player';
import axiosClient from '@/api/axiosClient';

export default function StudentLessonView() {
  const params = useParams();
  const lessonId = params.lessonId;

  // Video အချက်အလက်များ သိမ်းရန်
  const [lesson, setLesson] = useState(null);
  
  // Heartbeat အတွက် State များ
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0); // Video ကြာချိန် (စက္ကန့်)
  const intervalRef = useRef(null);

  // ၁။ Page စပွင့်တာနဲ့ Lesson အချက်အလက်ကို Backend မှ လှမ်းယူမည်
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        // မှတ်ချက်: Backend မှာ GET /api/lessons/:id ကို ရေးထားဖို့ လိုပါသည်
        const response = await axiosClient.get(`/lessons/${lessonId}`);
        setLesson(response.data);
      } catch (error) {
        console.error("Lesson ယူရာတွင် အမှားရှိပါသည်", error);
      }
    };
    if (lessonId) fetchLesson();
  }, [lessonId]);

  // ၂။ Heartbeat Logic (Play နေချိန်သာ အလုပ်လုပ်မည်)
  useEffect(() => {
    if (isPlaying) {
      // Video Play နေပါက ၁၀ စက္ကန့်ပြည့်တိုင်း Backend သို့ Data လှမ်းပို့မည်
      intervalRef.current = setInterval(() => {
        sendHeartbeat();
      }, 10000); 
    } else {
      // Pause လုပ်ထားလျှင် (သို့) ပြီးသွားလျှင် Timer ကို ရပ်ထားမည်
      clearInterval(intervalRef.current);
    }

    // Component ပိတ်သွားရင် (ကျောင်းသား Page ထွက်သွားရင်) Timer ဖျက်မည်
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, duration]);

  // ၃။ Backend သို့ Heartbeat ပို့သည့် Function
  const sendHeartbeat = async () => {
    try {
      await axiosClient.post('/progress/heartbeat', {
        lessonId: lessonId,
        incrementSeconds: 10,
        totalDuration: duration
      });
      console.log('💓 Heartbeat sent: +10 seconds');
    } catch (error) {
      console.error('Heartbeat ပို့ရာတွင် အမှားရှိပါသည်:', error);
    }
  };

  if (!lesson) return <div style={{ padding: '20px' }}>Loading Lesson...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <h2>{lesson.title}</h2>
      
      {/* React Player ဖြင့် Video ပြသခြင်း */}
      <div style={{ marginTop: '20px', borderRadius: '8px', overflow: 'hidden' }}>
        <ReactPlayer
          url={lesson.videoUrl} // ဥပမာ- YouTube Link
          controls={true} // Play/Pause ခလုတ်များ ပြမည်
          width="100%"
          height="450px"
          onPlay={() => setIsPlaying(true)} // Video စဖွင့်လျှင် Heartbeat စမည်
          onPause={() => setIsPlaying(false)} // Pause လုပ်လျှင် Heartbeat ရပ်မည်
          onEnded={() => setIsPlaying(false)} // Video ပြီးသွားလျှင် Heartbeat ရပ်မည်
          onDuration={(d) => setDuration(d)} // Video ၏ စုစုပေါင်းကြာချိန်ကို ယူမည်
        />
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
        <h3>သင်ခန်းစာ အကြောင်းအရာ</h3>
        <p>{lesson.content || 'အကြောင်းအရာ ဖော်ပြချက် မရှိပါ။'}</p>
      </div>
    </div>
  );
}