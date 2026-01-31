import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import QuestionRunner from "../components/QuestionRunner.jsx";

const PracticePage = () => {
  const [searchParams] = useSearchParams();
  const topicId = searchParams.get("topicId");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

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
    if (!topicId) return;

    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/topics/${topicId}/questions`
        );
        setQuestions(res.data.questions || []);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, [topicId]);

  if (!topicId) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Practice Mode</h2>
          <p className="mt-2 text-sm text-slate-600">
            Select a topic from the exam catalog to begin a practice session.
          </p>
          <Link
            to="/exams"
            className="mt-4 inline-flex rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Browse Exams
          </Link>
        </div>
      </section>
    );
  }

  if (loading) {
    return <p className="py-10 text-center text-sm text-slate-600">Loading questions...</p>;
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <QuestionRunner
        questions={questions}
        heading="Practice Mode"
        subheading="Full practice questions are unlocked after purchase."
      />
    </section>
  );
};

export default PracticePage;
