const questions = [
  {
    id: 1,
    text: "Which regulator oversees mutual fund distributors in India?",
    options: ["SEBI", "RBI", "IRDAI", "NABARD"],
    answer: "SEBI"
  },
  {
    id: 2,
    text: "What is the minimum subscription for an ELSS fund?",
    options: ["₹100", "₹500", "₹1000", "₹5000"],
    answer: "₹500"
  }
];

const PracticePage = () => (
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
                  className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700"
                >
                  <input type="radio" name={`question-${question.id}`} />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
              <span className="font-semibold text-green-600">Correct:</span> {question.answer}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
          Review later
        </button>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
          Submit practice session
        </button>
      </div>
    </div>
  </section>
);

export default PracticePage;
