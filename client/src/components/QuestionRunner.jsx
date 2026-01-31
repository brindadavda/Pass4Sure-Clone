import { useMemo, useState } from "react";

const QuestionRunner = ({ questions, heading, subheading }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const currentQuestion = questions[currentIndex];
  const selectedAnswer = currentQuestion ? answers[currentQuestion.id] : null;

  const progress = useMemo(() => {
    if (!questions.length) return 0;
    return Math.round(((currentIndex + 1) / questions.length) * 100);
  }, [currentIndex, questions.length]);

  const handleSelect = (option) => {
    if (!currentQuestion) return;
    setAnswers({ ...answers, [currentQuestion.id]: option });
  };

  const goNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const goPrevious = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  if (!currentQuestion) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-600 shadow-sm">
        No questions available for this topic.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">{heading}</h2>
          <p className="text-sm text-slate-600">{subheading}</p>
        </div>
        <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
          Question {currentIndex + 1} of {questions.length}
        </div>
      </div>

      <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="h-2 rounded-full bg-blue-600" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 p-6">
        <p className="text-sm font-semibold text-slate-900">{currentQuestion.questionText}</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {(currentQuestion.options || []).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(option)}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                selectedAnswer === option
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-slate-200 text-slate-700 hover:border-blue-300"
              }`}
            >
              <span className="text-sm">{option}</span>
            </button>
          ))}
        </div>

        {selectedAnswer && (
          <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-semibold text-green-600">
              Correct Answer: {currentQuestion.correctAnswer}
            </p>
            {currentQuestion.explanation && (
              <p className="mt-2 text-slate-600">{currentQuestion.explanation}</p>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={goPrevious}
          disabled={currentIndex === 0}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={currentIndex === questions.length - 1}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuestionRunner;
