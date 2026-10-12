// src/components/Navbar.jsx
'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('student'); // State for role

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role'); // Get role from storage
    
    setIsLoggedIn(!!token);
    setUserRole(role || 'student');
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setUserRole('student');
    alert('အကောင့်မှ ထွက်ပြီးပါပြီ။');
    router.push('/login');
  };

  return (
    <nav style={{ backgroundColor: '#0070f3', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <div>
        <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>LMS System</Link>
      </div>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>

        {isLoggedIn ? (
          <>
            {/* Show Admin Panel link only if the user is an admin */}
            {userRole === 'admin' && (
               <Link href="/admin/courses" style={{ color: '#ffeb3b', textDecoration: 'none', fontWeight: 'bold' }}>Admin Panel</Link>
            )}
            {userRole === 'admin' && (
               <Link href="/admin/progress" style={{ color: '#ffeb3b', textDecoration: 'none', fontWeight: 'bold' }}>Progress</Link>
            )}

            <Link href="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
            <Link href="/profile" style={{ color: 'white', textDecoration: 'none' }}>Profile</Link>
            <button onClick={handleLogout} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
            <Link href="/register" style={{ backgroundColor: 'white', color: '#0070f3', padding: '8px 15px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
