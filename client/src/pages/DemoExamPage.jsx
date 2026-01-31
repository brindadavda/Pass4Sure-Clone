import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import QuestionRunner from "../components/QuestionRunner.jsx";

const DemoExamPage = () => {
  const { topicId } = useParams();
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDemoQuestions = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/topics/${topicId}/questions?demo=true&limit=10`
        );
        setQuestions(res.data.questions || []);
      } catch (error) {
        console.error("Failed to load demo questions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDemoQuestions();
  }, [topicId]);

  if (!location.state?.accessCode) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-slate-600">
            Please generate and verify a demo access code before starting the exam.
          </p>
          <Link
            to={`/topic/${topicId}/demo-access`}
            className="mt-4 inline-flex rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Go to Demo Access
          </Link>
        </div>
      </section>
    );
  }

  if (loading) {
    return <p className="py-10 text-center text-sm text-slate-600">Loading demo exam...</p>;
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <QuestionRunner
        questions={questions}
        heading="Free Demo Exam"
        subheading="Answer a few sample questions and review explanations."
      />
    </section>
  );
};

export default DemoExamPage;
