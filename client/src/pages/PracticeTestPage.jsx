import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PRACTICE_CONTEXT_KEY = "pass4sure_practice_context";

const shuffleArray = (items) => {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const PracticeTestPage = () => {
  const { subjectId, topicId } = useParams();
  const API_URL = `${import.meta.env.VITE_API_URL}/api`;

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [topicName, setTopicName] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoadingQuestions(true);
      try {
        const res = await axios.get(
          `${API_URL}/practice/questions?subjectId=${subjectId}&topicId=${topicId}`
        );
        const questionList = res.data.questions || [];
        const selected = shuffleArray(questionList).slice(0, 10);
        setQuestions(selected);
        setAnswers({});
        setSubmitted(false);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
      } finally {
        setLoadingQuestions(false);
      }
    };

    if (subjectId && topicId) {
      fetchQuestions();
    }
  }, [API_URL, subjectId, topicId]);

  useEffect(() => {
    if (!topicName && questions.length === 0) {
      return;
    }
    const context = {
      subject: subjectId,
      topic: topicName || topicId,
      question: questions[0]?.text || "",
      explanation: questions[0]?.explanation || ""
    };
    localStorage.setItem(PRACTICE_CONTEXT_KEY, JSON.stringify(context));
  }, [subjectId, topicId, topicName, questions]);

  useEffect(() => {
    const fetchTopicName = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/practice/subjects/${subjectId}/topics`
        );
        const matchedTopic = (res.data.topics || []).find(
          (topic) => `${topic.topic_id}` === `${topicId}`
        );
        setTopicName(matchedTopic?.name || "");
      } catch (err) {
        console.error("Failed to fetch topic name:", err);
      }
    };

    if (subjectId && topicId) {
      fetchTopicName();
    }
  }, [API_URL, subjectId, topicId]);

  const handleSelect = (questionId, option) => {
    if (submitted) {
      return;
    }
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const isAnswerCorrect = (question, selectedOption) => {
    if (!selectedOption) {
      return false;
    }

    const normalizedCorrect = `${question.correct_answer}`.trim().toLowerCase();
    const normalizedSelected = `${selectedOption}`.trim().toLowerCase();

    if (normalizedSelected === normalizedCorrect) {
      return true;
    }

    const selectedIndex = question.options
      .slice(0, 3)
      .findIndex((option) => option === selectedOption);
    const selectedLabel = ["a", "b", "c"][selectedIndex];

    return selectedLabel === normalizedCorrect;
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          {topicName || "Practice Test"}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Select the best answer for each question and submit to see results.
        </p>

        {loadingQuestions && (
          <p className="mt-6 text-sm text-slate-500">Loading questions...</p>
        )}

        {!loadingQuestions && questions.length === 0 && (
          <p className="mt-6 text-sm text-slate-500">
            No questions available for this topic.
          </p>
        )}

        {!loadingQuestions && questions.length > 0 && (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="rounded-2xl border border-slate-200 p-5"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {index + 1}. {question.text}
                </p>

                <div className="mt-4 space-y-3">
                  {question.options.slice(0, 3).map((option, optionIndex) => {
                    const optionLabel = ["a", "b", "c"][optionIndex];
                    const isSelected = answers[question.id] === option;
                    const normalizedCorrect = `${question.correct_answer}`.trim().toLowerCase();
                    const normalizedOption = `${option}`.trim().toLowerCase();
                    const isCorrect =
                      submitted &&
                      (normalizedOption === normalizedCorrect ||
                        optionLabel === normalizedCorrect);
                    const isIncorrect =
                      submitted && isSelected && !isCorrect;

                    return (
                      <label
                        key={option}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                          isCorrect
                            ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                            : isIncorrect
                            ? "border-red-400 bg-red-50 text-red-700"
                            : "border-slate-200 text-slate-700"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option}
                          checked={isSelected}
                          onChange={() => handleSelect(question.id, option)}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="font-semibold uppercase text-slate-500">
                          {optionLabel}.
                        </span>
                        <span>{option}</span>
                      </label>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="mt-4 space-y-3 rounded-xl bg-slate-50 p-4 text-sm">
                    <div>
                      <span className="font-semibold text-emerald-600">
                        Correct Answer:
                      </span>{" "}
                      {question.correct_answer}
                    </div>
                  {answers[question.id] &&
                      question.explanation &&
                      !isAnswerCorrect(question, answers[question.id]) && (
                        <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-red-700">
                          <span className="font-semibold">Explanation:</span>{" "}
                          {question.explanation}
                        </div>
                      )}
                  </div>
                )}
              </div>
            ))}

            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
              disabled={submitted}
            >
              {submitted ? "Submitted" : "Submit Answers"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default PracticeTestPage;
