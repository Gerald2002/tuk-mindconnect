import { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

function TestFirebase() {
  const [user, setUser] = useState(null);
  const [testData, setTestData] = useState(null);
  const [error, setError] = useState('');

  // Track if auth is working
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  // Write and read Firestore test
  const testFirestore = async () => {
    try {
      const testRef = doc(db, 'test', 'check');
      await setDoc(testRef, { message: 'Firebase is working 🎉' });
      const snapshot = await getDoc(testRef);
      setTestData(snapshot.data());
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">🔧 Firebase Connection Test</h1>

      <div className="mb-4">
        <strong>Auth Status:</strong>{' '}
        {user ? `Logged in as ${user.email}` : 'Not logged in'}
      </div>

      <button
        onClick={testFirestore}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Test Firestore
      </button>

      {testData && (
        <div className="mt-4 text-green-600">
          <strong>Firestore Response:</strong> {testData.message}
        </div>
      )}

      {error && <div className="mt-4 text-red-600">{error}</div>}
    </div>
  );
}

export default TestFirebase;
