'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axiosClient from '@/api/axiosClient';

export default function CourseVideoPlayer() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id;

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  const playerRef = useRef(null);
  const intervalRef = useRef(null);

  // 1. Course နှင့် Lessons Data များ ဆွဲယူခြင်း
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchCourseData = async () => {
      try {
        const courseRes = await axiosClient.get(`/courses/${courseId}`);
        setCourse(courseRes.data);

        const lessonRes = await axiosClient.get('/lessons');
        const courseLessons = lessonRes.data.filter(
          (l) => l.course === courseId || l.course?._id === courseId
        );

        courseLessons.sort((a, b) => a.order - b.order);
        setLessons(courseLessons);

        if (courseLessons.length > 0) {
          setActiveLesson(courseLessons[0]);
        }
      } catch (error) {
        console.error('Data ယူရာတွင် အမှားရှိပါသည်:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, router]);

  // 2. YouTube Video ID သီးသန့် ခွဲထုတ်ပေးသည့် Function
  const getYouTubeId = (url) => {
    if (!url) return '';
    if (url.includes('watch?v=')) return url.split('watch?v=')[1]?.split('&')[0];
    if (url.includes('youtu.be/')) return url.split('youtu.be/')[1]?.split('?')[0];
    if (url.includes('embed/')) return url.split('embed/')[1]?.split('?')[0];
    return url;
  };

  // 3. Backend သို့ Progress (ရာခိုင်နှုန်း) လှမ်းပို့ပေးသည့် Function
  const saveProgressToBackend = async (percentage) => {
    if (!activeLesson || !course) return;

    try {
      await axiosClient.post('/progress/update', {
        courseId: course._id,
        lessonId: activeLesson._id,
        percentage: Math.min(100, Math.round(percentage))
      });
      console.log(`Progress Saved: ${Math.round(percentage)}%`);
    } catch (err) {
      console.error('Progress Sync Error:', err);
    }
  };

  // 4. Video ကြည့်နေစဉ် ၅ စက္ကန့်တစ်ကြိမ် မီတာစစ်ပြီး Progress ထည့်ပေးခြင်း
  useEffect(() => {
    if (!activeLesson) return;

    // YouTube API Load လုပ်ခြင်း
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    const videoId = getYouTubeId(activeLesson.videoUrl);

    window.onYouTubeIframeAPIReady = () => {
      loadPlayer(videoId);
    };

    if (window.YT && window.YT.Player) {
      loadPlayer(videoId);
    }

    function loadPlayer(vId) {
      if (playerRef.current) {
        playerRef.current.destroy(); // Player ဟောင်းကို ဖျက်ပြီး အသစ်ပြန်ဆောက်မည်
      }

      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: vId,
        events: {
          onStateChange: onPlayerStateChange
        }
      });
    }

    function onPlayerStateChange(event) {
      // event.data === 1 ဆိုသည်မှာ Video Play နေသည်ဟု အဓိပ္ပာယ်ရသည်
      if (event.data === window.YT.PlayerState.PLAYING) {
        if (intervalRef.current) clearInterval(intervalRef.current);

        // ၅ စက္ကန့်တိုင်းမှာ ကြည့်ပြီးသွားတဲ့ ရာခိုင်နှုန်းကို တွက်ချက်မည်
        intervalRef.current = setInterval(() => {
          if (playerRef.current && playerRef.current.getCurrentTime) {
            const currentTime = playerRef.current.getCurrentTime();
            const duration = playerRef.current.getDuration();

            if (duration > 0) {
              const currentPercent = (currentTime / duration) * 100;
              saveProgressToBackend(currentPercent);
            }
          }
        }, 5000);
      } else {
        // Video ရပ်သွားပါက (Pause / Ended) Interval ကို ရပ်မည်
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeLesson]);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Video Lessons...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link href="/dashboard" style={{ color: '#0070f3', textDecoration: 'none' }}>
          &larr; Dashboard သို့ ပြန်သွားမည်
        </Link>
        <h2 style={{ margin: '10px 0 5px 0' }}>{course?.title}</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '25px' }}>
        {/* Video Player Div */}
        <div>
          {activeLesson ? (
            <div style={{ backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                {/* YouTube Player ဖန်တီးမည့် Element ID */}
                <div
                  id="youtube-player"
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                ></div>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#fff' }}>
                <h3>Lesson {activeLesson.order}: {activeLesson.title}</h3>
              </div>
            </div>
          ) : (
            <div>သင်ခန်းစာများ မရှိသေးပါ။</div>
          )}
        </div>

        {/* Playlist Sidebar */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h4>သင်ခန်းစာများ ({lessons.length})</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {lessons.map((lesson) => (
              <button
                key={lesson._id}
                onClick={() => setActiveLesson(lesson)}
                style={{
                  padding: '10px',
                  borderRadius: '6px',
                  border: activeLesson?._id === lesson._id ? '1px solid #0070f3' : '1px solid #e2e8f0',
                  backgroundColor: activeLesson?._id === lesson._id ? '#eff6ff' : '#fff',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                {lesson.order}. {lesson.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}