import { useState } from 'react';
import { db, auth } from '../../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const options = [
  { label: 'Not at all', value: 0 },
  { label: 'Several days', value: 1 },
  { label: 'More than half the days', value: 2 },
  { label: 'Nearly every day', value: 3 }
];

const PHQ9 = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling or staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself',
  'Trouble concentrating',
  'Moving/speaking slowly or restlessness',
  'Thoughts of self-harm or suicide'
];

const GAD7 = [
  'Feeling nervous, anxious, or on edge',
  'Not being able to stop or control worrying',
  'Worrying too much about different things',
  'Trouble relaxing',
  'Being so restless that it’s hard to sit still',
  'Becoming easily annoyed or irritable',
  'Feeling afraid something awful might happen'
];

function interpretPHQ(score) {
  if (score < 5) return 'Minimal depression';
  if (score < 10) return 'Mild depression';
  if (score < 15) return 'Moderate depression';
  if (score < 20) return 'Moderately severe depression';
  return 'Severe depression';
}

function interpretGAD(score) {
  if (score < 5) return 'Minimal anxiety';
  if (score < 10) return 'Mild anxiety';
  if (score < 15) return 'Moderate anxiety';
  return 'Severe anxiety';
}

function Screening() {
  const [phqAnswers, setPhqAnswers] = useState(Array(PHQ9.length).fill(null));
  const [gadAnswers, setGadAnswers] = useState(Array(GAD7.length).fill(null));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const totalQuestions = PHQ9.length + GAD7.length;
  const progress = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const isPhq = currentIndex < PHQ9.length;
  const index = isPhq ? currentIndex : currentIndex - PHQ9.length;
  const question = isPhq ? PHQ9[index] : GAD7[index];
  const currentAnswer = isPhq ? phqAnswers[index] : gadAnswers[index];

  const handleOptionSelect = (value) => {
    if (isPhq) {
      const updated = [...phqAnswers];
      updated[index] = value;
      setPhqAnswers(updated);
    } else {
      const updated = [...gadAnswers];
      updated[index] = value;
      setGadAnswers(updated);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    const phqScore = phqAnswers.reduce((acc, val) => acc + (val ?? 0), 0);
    const gadScore = gadAnswers.reduce((acc, val) => acc + (val ?? 0), 0);
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not logged in');

      const timestamp = Date.now();
      const screeningId = `${user.uid}_${timestamp}`;

      await setDoc(doc(db, 'screenings', screeningId), {
        userId: user.uid,
        phqScore,
        gadScore,
        phqAnswers,
        gadAnswers,
        createdAt: serverTimestamp()
      });

      if (phqScore >= 10 || gadScore >= 10) {
        const referralId = `referral_${user.uid}_${timestamp}`;
        await setDoc(doc(db, 'referrals', referralId), {
          userId: user.uid,
          screeningId,
          phqScore,
          gadScore,
          status: 'pending',
          createdAt: serverTimestamp()
        });

        alert('A referral has been created based on your scores. A mental health specialist may contact you.');
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting screening:', err.message);
      alert('An error occurred while saving your results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderQuestion = () => (
    <div className="text-left">
      <h2 className="text-xl font-semibold mb-2">{isPhq ? 'PHQ-9 (Depression)' : 'GAD-7 (Anxiety)'}</h2>
      <p className="mb-4">{index + 1}. {question}</p>
      <div className="flex flex-col gap-2 mb-6">
        {options.map((opt, i) => (
          <label key={i} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={`q-${currentIndex}`}
              checked={currentAnswer === opt.value}
              onChange={() => handleOptionSelect(opt.value)}
              className="accent-blue-600"
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>

        {currentIndex < totalQuestions - 1 ? (
          <button
            onClick={handleNext}
            disabled={currentAnswer === null}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={currentAnswer === null || loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Mental Health Screening</h1>

      {!submitted ? (
        <div className="bg-white p-6 rounded shadow-md">
          <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {renderQuestion()}
        </div>
      ) : (
        <div className="text-center bg-white p-6 rounded shadow-md max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Screening Submitted</h2>

          <div className="mb-6">
            <p className="text-lg font-semibold mb-2 text-gray-700">Your Results</p>
            <div className="bg-gray-100 p-4 rounded">
              <p>
                <span className="font-medium">PHQ-9 Score:</span>{' '}
                {phqAnswers.reduce((acc, val) => acc + (val ?? 0), 0)} –{' '}
                <span className="italic">
                  {interpretPHQ(phqAnswers.reduce((acc, val) => acc + (val ?? 0), 0))}
                </span>
              </p>
              <p>
                <span className="font-medium">GAD-7 Score:</span>{' '}
                {gadAnswers.reduce((acc, val) => acc + (val ?? 0), 0)} –{' '}
                <span className="italic">
                  {interpretGAD(gadAnswers.reduce((acc, val) => acc + (val ?? 0), 0))}
                </span>
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Your results have been securely saved. You can view your full history or talk to the assistant if you need guidance.
          </p>

          <div className="flex justify-center gap-4">
            <a href="/screening-history" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              View History
            </a>
            <a href="/assistant" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
              Talk to Assistant
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default Screening;
