import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import TopicCard from "../components/TopicCard.jsx";

const ExamTopicsPage = () => {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExamTopics = async () => {
      try {
        const [examRes, topicsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/exams/${examId}`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/exams/${examId}/topics`)
        ]);
        setExam(examRes.data.exam);
        setTopics(topicsRes.data.topics || []);
      } catch (error) {
        console.error("Failed to load exam topics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExamTopics();
  }, [examId]);

  if (loading) {
    return <p className="py-10 text-center text-sm text-slate-600">Loading topics...</p>;
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-3xl font-semibold text-slate-900">{exam?.name}</h2>
        <p className="mt-2 text-sm text-slate-600">{exam?.description}</p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>
    </section>
  );
};

export default ExamTopicsPage;
