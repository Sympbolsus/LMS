// src/components/AdminNav.jsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Course များ စီမံရန်', href: '/admin/courses' },
    { label: 'ကျောင်းသား ကြည့်ရှုမှု (%)', href: '/admin/progress' }
  ];

  return (
    <nav style={{
      marginTop: '20px',
      backgroundColor: '#1e293b',
      padding: '15px 20px',
      borderRadius: '8px',
      marginBottom: '25px',
      display: 'flex',
      gap: '15px'
    }}>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              color: isActive ? '#ffffff' : '#94a3b8',
              backgroundColor: isActive ? '#3b82f6' : 'transparent',
              padding: '8px 16px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: isActive ? 'bold' : 'normal',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}