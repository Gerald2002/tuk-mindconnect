import { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

function Profile() {
  const [userData, setUserData] = useState({ name: '', email: '', bio: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const user = auth.currentUser;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const userRef = doc(db, 'users', user.uid);
        const snapshot = await getDoc(userRef);
        if (snapshot.exists()) {
          setUserData(snapshot.data());
        } else {
          // fallback to auth info
          setUserData({ name: user.displayName || '', email: user.email, bio: '' });
        }
      } catch (error) {
        console.error('Failed to load profile:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, userData, { merge: true });
      alert('Profile updated successfully.');
    } catch (error) {
      console.error('Error saving profile:', error.message);
      alert('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Loading profile...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Your Profile</h1>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input
            name="name"
            value={userData.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Email</label>
          <input
            name="email"
            value={userData.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            disabled
          />
        </div>

        <div>
          <label className="block font-medium">Bio</label>
          <textarea
            name="bio"
            value={userData.bio}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows={4}
            placeholder="Tell us a bit about yourself"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

export default Profile;
