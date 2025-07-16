import { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { auth, db } from '../../firebase';

function Forum() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, 'forumPosts'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const fetchedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(fetchedPosts);
    } catch (err) {
      console.error('Error loading forum posts:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleChange = (e) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return alert('Please fill in both fields.');

    setPosting(true);
    try {
      await addDoc(collection(db, 'forumPosts'), {
        ...newPost,
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        createdAt: serverTimestamp()
      });
      setNewPost({ title: '', content: '' });
      fetchPosts(); // Refresh post list
    } catch (err) {
      console.error('Error posting:', err.message);
      alert('Failed to post. Try again.');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Student Forum</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          type="text"
          name="title"
          value={newPost.title}
          onChange={handleChange}
          placeholder="Post Title"
          className="w-full border px-3 py-2 rounded"
        />
        <textarea
          name="content"
          value={newPost.content}
          onChange={handleChange}
          placeholder="Write something helpful or ask a question..."
          rows={4}
          className="w-full border px-3 py-2 rounded"
        />
        <button
          type="submit"
          disabled={posting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {posting ? 'Posting...' : 'Post'}
        </button>
      </form>

      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p>No posts yet. Start the conversation!</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="p-4 border rounded shadow-sm bg-white">
              <h3 className="text-lg font-semibold">{post.title}</h3>
              <p className="mt-1">{post.content}</p>
              <div className="text-sm text-gray-500 mt-2">
                Posted by {post.userEmail || 'Anonymous'} on{' '}
                {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleString() : 'Unknown date'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Forum;
