import './globals.css'; // သင့်ဆီမှာ ဒီဖိုင်ရှိရင် ထားပါ၊ မရှိရင် ဖျက်လို့ရပါတယ်
import Navbar from '@/components/Navbar'; // စောစောက ရေးထားသော Navbar ကို လှမ်းခေါ်ခြင်း

export const metadata = {
  title: 'My LMS System',
  description: 'Learning Management System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true} style={{ margin: 0, padding: 0 }}>
        <Navbar />
        <main style={{ minHeight: '80vh' }}>
          {children}
        </main>
      </body>
    </html>
  );
}