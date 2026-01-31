import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const TopicDetailPage = () => {
  const { topicId } = useParams();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/topics/${topicId}`);
        setTopic(res.data.topic);
      } catch (error) {
        console.error("Failed to load topic", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopic();
  }, [topicId]);

  if (loading) {
    return <p className="py-10 text-center text-sm text-slate-600">Loading topic...</p>;
  }

  if (!topic) {
    return <p className="py-10 text-center text-sm text-slate-600">Topic not found.</p>;
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-blue-600">{topic.examName}</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">{topic.title}</h2>
        <p className="mt-3 text-sm text-slate-600">{topic.fullDescription}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to={`/topic/${topic.id}/demo-access`}
            className="rounded-md border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600"
          >
            Free Demo
          </Link>
          <Link
            to={`/checkout/${topic.id}`}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Buy Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopicDetailPage;
