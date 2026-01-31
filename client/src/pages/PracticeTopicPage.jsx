import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const PracticeTopicPage = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const API_URL = `${import.meta.env.VITE_API_URL}/api`;

  const [topics, setTopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [demoCodes, setDemoCodes] = useState({});
  const [enteredCode, setEnteredCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [loadingTopics, setLoadingTopics] = useState(false);

  useEffect(() => {
    const fetchTopics = async () => {
      setLoadingTopics(true);
      try {
        const res = await axios.get(
          `${API_URL}/practice/subjects/${subjectId}/topics`
        );
        setTopics(res.data.topics || []);
      } catch (err) {
        console.error("Failed to fetch topics:", err);
      } finally {
        setLoadingTopics(false);
      }
    };

    if (subjectId) {
      fetchTopics();
    }
  }, [API_URL, subjectId]);

  const handleFreeDemo = async (topicId) => {
    setSelectedTopicId(topicId);
    setEnteredCode("");
    setCodeError("");

    if (demoCodes[topicId]) {
      return;
    }

    try {
      const res = await axios.get(
        `${API_URL}/practice/topics/${topicId}/demo-code`
      );
      setDemoCodes((prev) => ({ ...prev, [topicId]: res.data.demoCode || "" }));
    } catch (err) {
      console.error("Failed to fetch demo code:", err);
      setDemoCodes((prev) => ({ ...prev, [topicId]: "" }));
    }
  };

  const handleVerifyCode = (topicId) => {
    const demoCode = demoCodes[topicId];

    if (!demoCode) {
      setCodeError("Demo code unavailable for this topic.");
      return;
    }

    if (enteredCode.trim() !== demoCode) {
      setCodeError("Incorrect code. Please try again.");
      return;
    }

    setCodeError("");
    navigate(`/practice/${subjectId}/topics/${topicId}`);
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Topics</h1>
          <p className="text-sm text-slate-600">
            Unlock a free demo by entering the code for your selected topic.
          </p>
        </div>

        {loadingTopics && (
          <p className="mt-6 text-sm text-slate-500">Loading topics...</p>
        )}

        {!loadingTopics && (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {topics.map((topic) => (
              <div
                key={topic.topic_id}
                className="rounded-2xl border border-slate-200 p-5 shadow-sm"
              >
                <h2 className="text-base font-semibold text-slate-900">
                  {topic.name}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {topic.description}
                </p>

                <button
                  className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                  onClick={() => handleFreeDemo(topic.topic_id)}
                >
                  Free Demo
                </button>

                {selectedTopicId === topic.topic_id && (
                  <div className="mt-4 rounded-xl border bg-slate-50 p-4">
                    <input
                      value={enteredCode}
                      onChange={(event) => setEnteredCode(event.target.value)}
                      placeholder="Enter demo code"
                      className="w-full rounded-lg border px-3 py-2 text-sm"
                    />

                    {codeError && (
                      <p className="mt-2 text-xs font-semibold text-red-600">
                        {codeError}
                      </p>
                    )}

                    <button
                      className="mt-3 w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                      onClick={() => handleVerifyCode(topic.topic_id)}
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PracticeTopicPage;
