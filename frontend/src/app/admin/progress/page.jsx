'use client';

import { useEffect, useState } from 'react';
import axiosClient from '@/api/axiosClient';
import AdminNav from '@/components/AdminNav'; // <-- AdminNav ကို Import လုပ်ပါ

export default function AdminProgressPage() {
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axiosClient.get('/progress/admin/all');
        setProgressList(res.data);
      } catch (err) {
        console.error("Data ဆွဲယူ၍ မရပါ:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  return (
    <div style={{ padding: '30px', maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* Admin Navigation Menu */}
      <AdminNav />

      <h2 style={{ color: '#0f172a', marginBottom: '20px' }}>
        📊 ကျောင်းသားများ၏ သင်ခန်းစာ ကြည့်ရှုပြီးစီးမှု အခြေအနေ
      </h2>

      {loading ? (
        <div>Loading Progress Data...</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', textAlign: 'left', color: '#475569' }}>
              <th style={{ padding: '12px 16px', borderBottom: '2px solid #e2e8f0' }}>ကျောင်းသား</th>
              <th style={{ padding: '12px 16px', borderBottom: '2px solid #e2e8f0' }}>Course</th>
              <th style={{ padding: '12px 16px', borderBottom: '2px solid #e2e8f0' }}>Lesson</th>
              <th style={{ padding: '12px 16px', borderBottom: '2px solid #e2e8f0' }}>ကြည့်ပြီးစီးမှု %</th>
              <th style={{ padding: '12px 16px', borderBottom: '2px solid #e2e8f0' }}>အခြေအနေ</th>
            </tr>
          </thead>
          <tbody>
            {progressList.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                  မည်သည့် ကြည့်ရှုမှု မှတ်တမ်းမှ မရှိသေးပါ။
                </td>
              </tr>
            ) : (
              progressList.map((item) => (
                <tr key={item._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px' }}>{item.user?.name || 'N/A'}<br/><small style={{ color: '#94a3b8' }}>{item.user?.email}</small></td>
                  <td style={{ padding: '12px 16px' }}>{item.course?.title || 'N/A'}</td>
                  <td style={{ padding: '12px 16px' }}>{item.lesson?.title || 'N/A'}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 'bold', color: '#0284c7' }}>{item.watchedPercentage}%</td>
                  <td style={{ padding: '12px 16px' }}>
                    {item.isCompleted ? (
                      <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                        ✓ ပြီးမြောက်ပါသည်
                      </span>
                    ) : (
                      <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '4px 10px', borderRadius: '12px', fontSize: '12px' }}>
                        ⏳ ကြည့်ရှုဆဲ
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}