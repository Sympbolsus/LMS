'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axiosClient from '@/api/axiosClient';

export default function AdminCourses() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for creating a new course
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  // Fetch courses on load
  const fetchCourses = async () => {
    try {
      const response = await axiosClient.get('/courses');
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses", error);
      // Optional: if unauthorized, redirect to login
      if (error.response?.status === 401 || error.response?.status === 403) {
         router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only admins should be here, basic client-side check
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      alert("Admin access required.");
      router.push('/');
    } else {
      fetchCourses();
    }
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!title) return alert("Course title is required");
    
    setCreating(true);
    try {
      const response = await axiosClient.post('/courses', { title, description });
      alert('Course created successfully!');
      setTitle('');
      setDescription('');
      // Refresh the course list
      fetchCourses();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to create course');
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading Courses...</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px' }}>
      <h2>Admin Panel: Course Management</h2>

      {/* Form to create a new course */}
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h3>Create New Course</h3>
        <form onSubmit={handleCreateCourse} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Course Title:</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              placeholder="e.g. Next.js Masterclass"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Description:</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              rows="3"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              placeholder="Short description of the course..."
            />
          </div>
          <button 
            type="submit" 
            disabled={creating}
            style={{ padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', alignSelf: 'flex-start' }}
          >
            {creating ? 'Creating...' : 'Create Course'}
          </button>
        </form>
      </div>

      {/* List of existing courses */}
      <h3>Existing Courses</h3>
      {courses.length === 0 ? (
        <p>No courses found. Create one above!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', marginTop: '15px' }}>
          {courses.map(course => (
            <div key={course._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0' }}>{course.title}</h4>
                <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>{course.description || "No description provided."}</p>
              </div>
              <Link href={`/admin/courses/${course._id}`}>
                <button style={{ padding: '8px 12px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Manage Lessons
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}