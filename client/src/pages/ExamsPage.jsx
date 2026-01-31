import { useEffect, useState } from "react";
import axios from "axios";
import ExamCard from "../components/ExamCard.jsx";

// const exams = [
//   {
//     id: 1,
//     title: "NISM Series V-A",
//     category: "NISM",
//     price: "1299",
//     validity: "30 days",
//     description: "Mutual fund certification with 750+ curated questions."
//   },
//   {
//     id: 2,
//     title: "NCFM Capital Markets",
//     category: "NCFM",
//     price: "999",
//     validity: "60 days",
//     description: "Practice key market concepts with live exam simulator."
//   },
//   {
//     id: 3,
//     title: "BSE Derivatives",
//     category: "BSE",
//     price: "1499",
//     validity: "90 days",
//     description: "Advanced derivative strategy questions with analytics."
//   }
// ];

const ExamsPage = () => {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_API_URL + "/api/exams"
        );
        setExams(res.data.exams);
      } catch (err) {
        console.error("Failed to fetch exams:", err);
      }
    };
    fetchExams();
  }, []);

  // ✅ You must return the JSX
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900">Certification exams</h2>
          <p className="mt-2 text-sm text-slate-600">
            Choose an exam to explore topics and start a free demo.
          </p>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search exams"
            className="w-56 rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <select className="rounded-md border border-slate-300 px-3 py-2 text-sm">
            <option>All categories</option>
            <option>NISM</option>
            <option>NCFM</option>
            <option>BSE</option>
            <option>IT</option>
          </select>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {exams?.map((exam) => (
          <ExamCard key={exam.id} exam={exam} />
        ))}
      </div>
    </section>
  );
};

export default ExamsPage;
