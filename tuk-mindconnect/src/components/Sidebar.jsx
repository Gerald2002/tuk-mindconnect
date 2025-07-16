import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Take Screening', path: '/screening' },
  { label: 'Chat Assistant', path: '/chatbot' },
  { label: 'Student Forum', path: '/forum' },
  { label: 'Referrals', path: '/referrals' },
  { label: 'Screening History', path: '/screening-history' },
  { label: 'Profile Settings', path: '/profile' },
  { label: 'Logout', path: '/' } // Just redirects to login for now
];

function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-white border-r min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6 text-blue-600">TUK-MindConnect</h2>
      <nav className="space-y-3">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`block px-3 py-2 rounded hover:bg-blue-100 ${
              location.pathname === link.path ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
