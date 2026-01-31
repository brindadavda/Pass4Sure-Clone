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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All categories");

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

  const categories = [
    "All categories",
    ...Array.from(new Set(exams.map((exam) => exam.category).filter(Boolean))),
  ];

  const filteredExams = exams.filter((exam) => {
    const matchesCategory =
      selectedCategory === "All categories" ||
      exam.category === selectedCategory;
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch =
      term.length === 0 ||
      `${exam.title}`.toLowerCase().includes(term) ||
      `${exam.description}`.toLowerCase().includes(term);

    return matchesCategory && matchesSearch;
  });

  // ✅ You must return the JSX
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900">Certification exams</h2>
          <p className="mt-2 text-sm text-slate-600">
            Filter by category, compare prices, and unlock full practice banks.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            placeholder="Search exams"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm sm:w-56"
          />
          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredExams.map((exam) => (
          <ExamCard key={exam.id} exam={exam} />
        ))}
        {filteredExams.length === 0 && (
          <p className="text-sm text-slate-500">
            No exams match your search.
          </p>
        )}
      </div>
    </section>
  );
};

export default ExamsPage;
