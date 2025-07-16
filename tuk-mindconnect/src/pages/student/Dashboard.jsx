import { useEffect, useState } from 'react';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';

function StudentDashboard() {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      }
    });

    return () => unsubscribe(); // cleanup
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">
        Welcome back 👋
      </h1>
      <p className="text-gray-600 mb-8">Logged in as: {userEmail}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Screening Card */}
        <div className="bg-white shadow rounded p-5 hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-2 text-blue-600">Mental Health Screening</h2>
          <p className="text-sm text-gray-500 mb-4">Check your mental health status or review past results.</p>
          <a href="/screening" className="text-sm text-blue-500 hover:underline">Take Screening</a>
        </div>

        {/* Chatbot Card */}
        <div className="bg-white shadow rounded p-5 hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-2 text-blue-600">AI Chat Assistant</h2>
          <p className="text-sm text-gray-500 mb-4">Talk to the assistant any time you feel overwhelmed.</p>
          <a href="/chatbot" className="text-sm text-blue-500 hover:underline">Start Chat</a>
        </div>

        {/* Forum Card */}
        <div className="bg-white shadow rounded p-5 hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-2 text-blue-600">Student Forum</h2>
          <p className="text-sm text-gray-500 mb-4">Share and connect with others in the student community.</p>
          <a href="/forum" className="text-sm text-blue-500 hover:underline">Go to Forum</a>
        </div>

        {/* Referrals Card */}
        <div className="bg-white shadow rounded p-5 hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-2 text-blue-600">Referrals</h2>
          <p className="text-sm text-gray-500 mb-4">View your current or past mental health referrals.</p>
          <a href="/referrals" className="text-sm text-blue-500 hover:underline">View Referrals</a>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
