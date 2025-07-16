import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { format } from 'date-fns';

function ScreeningHistory() {
  const [screenings, setScreenings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScreenings = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
          collection(db, 'screenings'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        setScreenings(data);
      } catch (error) {
        console.error('Error fetching screenings:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchScreenings();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Screening History</h1>

      {loading ? (
        <p>Loading your screenings...</p>
      ) : screenings.length === 0 ? (
        <p className="text-gray-600">You haven't completed any screenings yet.</p>
      ) : (
        <div className="space-y-4">
          {screenings.map((s) => (
            <div
              key={s.id}
              className="p-4 border rounded shadow-sm bg-white flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div>
                <p><span className="font-semibold">PHQ-9 Score:</span> {s.phqScore}</p>
                <p><span className="font-semibold">GAD-7 Score:</span> {s.gadScore}</p>
              </div>
              <div className="mt-2 md:mt-0 text-sm text-gray-500">
                {s.createdAt?.toDate ? format(s.createdAt.toDate(), 'PPPp') : 'Unknown date'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ScreeningHistory;
