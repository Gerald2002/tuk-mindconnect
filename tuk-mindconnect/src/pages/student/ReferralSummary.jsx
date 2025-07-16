import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, auth } from '../../firebase'; // Adjust path if needed
import { format } from 'date-fns';

function ReferralSummary() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
          collection(db, 'referrals'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        setReferrals(data);
      } catch (error) {
        console.error('Error fetching referrals:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Referral Summary</h1>

      {loading ? (
        <p>Loading your referrals...</p>
      ) : referrals.length === 0 ? (
        <p className="text-gray-600">You have no referrals yet.</p>
      ) : (
        <div className="space-y-4">
          {referrals.map((ref) => (
            <div
              key={ref.id}
              className="p-4 border rounded shadow-sm bg-white flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div>
                <p><span className="font-semibold">Referral ID:</span> {ref.id}</p>
                <p><span className="font-semibold">PHQ-9 Score:</span> {ref.phqScore}</p>
                <p><span className="font-semibold">GAD-7 Score:</span> {ref.gadScore}</p>
                <p>
                  <span className="font-semibold">Status:</span>{' '}
                  <span className={`font-bold ${ref.status === 'completed' ? 'text-green-600' : ref.status === 'pending' ? 'text-yellow-600' : 'text-blue-600'}`}>
                    {ref.status}
                  </span>
                </p>
              </div>
              <div className="mt-2 md:mt-0 text-sm text-gray-500">
                {ref.createdAt?.toDate ? format(ref.createdAt.toDate(), 'PPPp') : 'Unknown date'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReferralSummary;
