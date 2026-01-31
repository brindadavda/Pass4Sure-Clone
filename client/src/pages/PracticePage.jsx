import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const PracticePage = () => {
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);

  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState("");

  const [demoCode, setDemoCode] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const [codeError, setCodeError] = useState("");

  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // ✅ New state for expanding options
  const [expandedQuestions, setExpandedQuestions] = useState({});

  const [searchParams] = useSearchParams();
  const subjectIdParam = searchParams.get("subjectId");
  const topicIdParam = searchParams.get("topicId");

  const navigate = useNavigate();
  const API_URL = `${import.meta.env.VITE_API_URL}/api`;

  // -----------------------------
  // Toggle Options Expand/Collapse
  // -----------------------------
  const toggleOptions = (qid) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [qid]: !prev[qid],
    }));
  };

  // -----------------------------
  // Fetch Subjects
  // -----------------------------
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get(`${API_URL}/practice/subjects`);
        setSubjects(res.data.subjects || []);
      } catch (err) {
        console.error("Failed to fetch subjects:", err);
      }
    };
    fetchSubjects();
  }, [API_URL]);

  // -----------------------------
  // Read Params
  // -----------------------------
  useEffect(() => {
    if (subjectIdParam) setSelectedSubjectId(subjectIdParam);
    if (topicIdParam) setSelectedTopicId(topicIdParam);
  }, [subjectIdParam, topicIdParam]);

  // -----------------------------
  // Fetch Topics
  // -----------------------------
  useEffect(() => {
    if (!selectedSubjectId) {
      setTopics([]);
      return;
    }

    const fetchTopics = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/practice/subjects/${selectedSubjectId}/topics`
        );
        setTopics(res.data.topics || []);
      } catch (err) {
        console.error("Failed to fetch topics:", err);
      }
    };

    fetchTopics();
  }, [API_URL, selectedSubjectId]);

  // -----------------------------
  // Fetch Questions
  // -----------------------------
  useEffect(() => {
    if (!subjectIdParam || !topicIdParam) {
      setQuestions([]);
      return;
    }

    const fetchQuestions = async () => {
      setLoadingQuestions(true);

      try {
        const res = await axios.get(
          `${API_URL}/practice/questions?subjectId=${subjectIdParam}&topicId=${topicIdParam}`
        );

        setQuestions(res.data.questions || []);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, [API_URL, subjectIdParam, topicIdParam]);

  // -----------------------------
  // Subject Change Handler
  // -----------------------------
  const handleSubjectChange = (event) => {
    const subjectId = event.target.value;

    setSelectedSubjectId(subjectId);
    setSelectedTopicId("");
    setDemoCode("");
    setEnteredCode("");
    setCodeError("");
    if (subjectId) {
      navigate(`/practice?subjectId=${subjectId}`);
    } else {
      navigate("/practice");
    }
  };

  // -----------------------------
  // Free Demo Handler
  // -----------------------------
  const handleFreeDemo = async (topicId) => {
    setSelectedTopicId(topicId);
    setEnteredCode("");
    setCodeError("");

    try {
      const res = await axios.get(
        `${API_URL}/practice/topics/${topicId}/demo-code`
      );
      setDemoCode(res.data.demoCode || "");
    } catch (err) {
      console.error("Failed to fetch demo code:", err);
      setDemoCode("");
    }
  };

  // -----------------------------
  // Verify Code Handler
  // -----------------------------
  const handleVerifyCode = () => {
    if (!demoCode) {
      setCodeError("Demo code unavailable for this topic.");
      return;
    }

    if (enteredCode.trim() !== demoCode) {
      setCodeError("Incorrect code. Please try again.");
      return;
    }

    setCodeError("");
    navigate(`/practice/${selectedSubjectId}/topics/${selectedTopicId}`);
  };

  const selectedSubject = subjects.find(
    (subject) => `${subject.subject_id}` === `${selectedSubjectId}`
  );

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Practice Mode
            </h2>
            <p className="text-sm text-slate-600">
              Select a subject, unlock a demo topic, and start practicing.
            </p>
          </div>
        </div>

        {/* Subject Dropdown */}
        <div className="mt-6">
          <label className="text-sm font-semibold text-slate-700">
            Select Subject
          </label>

          <select
            value={selectedSubjectId}
            onChange={handleSubjectChange}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
              <option key={subject.subject_id} value={subject.subject_id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        {/* Topics Section */}
        {!topicIdParam && (
          <div className="mt-8">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold text-slate-900">Topics</h3>
              {selectedSubject && (
                <p className="text-sm text-slate-600">
                  Subject:{" "}
                  <span className="font-semibold text-slate-900">
                    {selectedSubject.name}
                  </span>
                </p>
              )}
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {topics.map((topic) => (
                <div
                  key={topic.topic_id}
                  className="rounded-2xl border border-slate-200 p-5 shadow-sm"
                >
                  <h4 className="text-base font-semibold text-slate-900">
                    {topic.name}
                  </h4>
                  <p className="mt-2 text-sm text-slate-600">
                    {topic.description}
                  </p>

                  <button
                    className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                    onClick={() => handleFreeDemo(topic.topic_id)}
                  >
                    Free Demo
                  </button>

                  {/* Demo Code Box */}
                  {selectedTopicId === topic.topic_id && (
                    <div className="mt-4 rounded-xl border bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">
                        Demo code:{" "}
                        <span className="font-semibold">
                          {demoCode || "--"}
                        </span>
                      </p>

                      <input
                        value={enteredCode}
                        onChange={(e) => setEnteredCode(e.target.value)}
                        placeholder="Enter demo code"
                        className="mt-3 w-full rounded-lg border px-3 py-2 text-sm"
                      />

                      {codeError && (
                        <p className="mt-2 text-xs font-semibold text-red-600">
                          {codeError}
                        </p>
                      )}

                      <button
                        className="mt-3 w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                        onClick={handleVerifyCode}
                      >
                        Submit
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Questions Section */}
        {subjectIdParam && topicIdParam && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-slate-900">
              Practice Questions
            </h3>

            {loadingQuestions && (
              <p className="mt-4 text-sm text-slate-500">
                Loading questions...
              </p>
            )}

            {!loadingQuestions && (
              <div className="mt-6 space-y-6">
                {questions.map((question) => (
                  <div
                    key={question.id} // ✅ Correct UUID key
                    className="rounded-2xl border border-slate-200 p-5"
                  >
                    {/* Question */}
                    <p className="text-sm font-semibold text-slate-900">
                      {question.text}
                    </p>

                    {/* Options */}
                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                      {(expandedQuestions[question.id]
                        ? question.options // show all
                        : [question.options[0]] // show first only
                      ).map((option, index) => (
                        <div
                          key={index}
                          className="rounded-xl border px-4 py-3 text-sm text-slate-700"
                        >
                          {option}
                        </div>
                      ))}
                    </div>

                    {/* Toggle Button */}
                    <button
                      onClick={() => toggleOptions(question.id)}
                      className="mt-3 text-sm font-semibold text-blue-600 hover:underline"
                    >
                      {expandedQuestions[question.id]
                        ? "Show Less"
                        : "Show All Options"}
                    </button>

                    {/* Answer */}
                    <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm">
                      <span className="font-semibold text-green-600">
                        Answer:
                      </span>{" "}
                      {question.correct_answer}
                    </div>
                  </div>
                ))}

                {questions.length === 0 && (
                  <p className="text-sm text-slate-500">No questions found.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default PracticePage;
