import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import StatCard from "../components/StatCard.jsx";

const DashboardPage = () => {
  const [exams, setExams] = useState([]);
  const [loadingExams, setLoadingExams] = useState(false);

  const API_URL = `${import.meta.env.VITE_API_URL}/api`;

  useEffect(() => {
    const fetchExams = async () => {
      setLoadingExams(true);
      try {
        const res = await axios.get(`${API_URL}/exams`);
        setExams(res.data.exams || []);
      } catch (err) {
        console.error("Failed to fetch exams:", err);
      } finally {
        setLoadingExams(false);
      }
    };

    fetchExams();
  }, [API_URL]);

  const stats = useMemo(() => {
    if (!exams.length) {
      return {
        totalExams: 0,
        categories: 0,
        averagePrice: 0,
        averageValidity: 0,
      };
    }

    const uniqueCategories = new Set(exams.map((exam) => exam.category).filter(Boolean));
    const totalPrice = exams.reduce((sum, exam) => sum + Number(exam.price || 0), 0);
    const totalValidity = exams.reduce(
      (sum, exam) => sum + Number(exam.validity_days || 0),
      0
    );

    return {
      totalExams: exams.length,
      categories: uniqueCategories.size,
      averagePrice: totalPrice / exams.length,
      averageValidity: totalValidity / exams.length,
    };
  }, [exams]);

  const formatCurrency = (value) =>
    value
      ? new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }).format(value)
      : "₹0";

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex-1 space-y-6">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900">
              Welcome back, Ananya
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Track your available exams and subscription highlights.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard
              label="Available exams"
              value={stats.totalExams}
              meta="Live catalog"
            />
            <StatCard
              label="Exam categories"
              value={stats.categories}
              meta="Across disciplines"
            />
            <StatCard
              label="Average price"
              value={formatCurrency(Math.round(stats.averagePrice))}
              meta="Per exam"
            />
            <StatCard
              label="Average validity"
              value={`${Math.round(stats.averageValidity)} days`}
              meta="Per subscription"
            />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Exam highlights
              </h3>
              {loadingExams && (
                <span className="text-xs font-semibold text-slate-400">
                  Loading...
                </span>
              )}
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Visit the Exams tab to browse the full catalog and purchase plans.
            </p>
          </div>
        </div>
        <aside className="w-full max-w-sm space-y-4">
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
            <h3 className="text-lg font-semibold text-blue-900">
              Subscription alerts
            </h3>
            <p className="mt-2 text-sm text-blue-800">
              Keep an eye on renewals and expiring access to stay exam-ready.
            </p>
            <button className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
              Review plans
            </button>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">AI study plan</h3>
            <p className="mt-2 text-sm text-slate-600">
              Generate a personalized plan based on your exam catalog.
            </p>
            <button className="mt-4 rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
              Generate plan
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default DashboardPage;
