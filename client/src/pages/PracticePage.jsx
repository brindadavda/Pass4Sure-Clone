// const questions = [
//   {
//     id: 1,
//     text: "Which regulator oversees mutual fund distributors in India?",
//     options: ["SEBI", "RBI", "IRDAI", "NABARD"],
//     answer: "SEBI"
//   },
//   {
//     id: 2,
//     text: "What is the minimum subscription for an ELSS fund?",
//     options: ["₹100", "₹500", "₹1000", "₹5000"],
//     answer: "₹500"
//   }
// ];

import { useEffect, useState } from "react";
import axios from "axios";

const examId = "634de6ef-8483-481b-9ae5-e747ba7f5e04";

const PracticePage = ({ examId }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({}); // store selected answers

  const token = localStorage.getItem("token"); // replace with your auth logic
  const API_URL = import.meta.env.VITE_API_URL+"/api";

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`${API_URL}/questions/exam/${examId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestions(res.data.questions);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [examId]);

  const handleSelect = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const handleSubmit = async () => {
    try {
      for (const question of questions) {
        const selected = answers[question.id];
        if (!selected) continue;

        const isCorrect = selected === question.correct_answer;

        await axios.post(
          `${API_URL}/questions/response`,
          {
            questionId: question.id,
            answer: selected,
            isCorrect,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      alert("Practice session submitted!");
    } catch (err) {
      console.error("Failed to submit responses:", err);
    }
  };

  if (loading) return <p className="text-center py-10">Loading questions...</p>;

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Practice Mode</h2>
            <p className="text-sm text-slate-600">
              Immediate feedback, explanations, and bookmark tools.
            </p>
          </div>
          <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
            12:45 remaining
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {questions.map((question) => (
            <div key={question.id} className="rounded-2xl border border-slate-200 p-5">
              <p className="text-sm font-semibold text-slate-900">{question.text}</p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {question.options.map((option) => (
                  <label
                    key={option}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                      answers[question.id] === option
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-slate-200 text-slate-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      checked={answers[question.id] === option}
                      onChange={() => handleSelect(question.id, option)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>

              {/* Optional: show explanation immediately */}
              {answers[question.id] && (
                <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                  <span className="font-semibold text-green-600">Correct:</span>{" "}
                  {question.correct_answer}
                  {question.explanation && (
                    <p className="mt-1 text-gray-500">{question.explanation}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
            Review later
          </button>
          <button
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
            onClick={handleSubmit}
          >
            Submit practice session
          </button>
        </div>
      </div>
    </section>
  );
};

export default PracticePage;
