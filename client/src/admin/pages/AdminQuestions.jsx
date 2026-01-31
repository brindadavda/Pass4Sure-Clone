import { useEffect, useMemo, useState } from "react";
import api from "../../lib/api.js";
import Modal from "../components/Modal.jsx";
import Pagination from "../components/Pagination.jsx";
import { calculateTotalPages, paginateItems } from "../utils.js";

const pageSize = 6;

const defaultForm = {
  subjectId: "",
  topicId: "",
  atomicTopicId: "",
  text: "",
  optionA: "",
  optionB: "",
  optionC: "",
  correctAnswer: "a",
  explanation: "",
  difficulty: "medium",
  isDemo: false
};

const AdminQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [atomicTopics, setAtomicTopics] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [activeQuestion, setActiveQuestion] = useState(null);

  const loadData = async () => {
    const [questionsRes, subjectsRes, topicsRes, atomicRes] = await Promise.all([
      api.get("/api/admin/questions"),
      api.get("/api/admin/subjects"),
      api.get("/api/admin/topics"),
      api.get("/api/admin/atomic-topics")
    ]);
    setQuestions(questionsRes.data.questions || []);
    setSubjects(subjectsRes.data.subjects || []);
    setTopics(topicsRes.data.topics || []);
    setAtomicTopics(atomicRes.data.atomicTopics || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return questions.filter((question) =>
      [
        question.text,
        question.correct_answer,
        question.difficulty,
        String(question.subject_id),
        String(question.topic_id)
      ].some((value) => String(value || "").toLowerCase().includes(term))
    );
  }, [questions, search]);

  const totalPages = calculateTotalPages(filtered, pageSize);
  const paginated = paginateItems(filtered, page, pageSize);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const openAdd = () => {
    setFormData(defaultForm);
    setIsAddOpen(true);
  };

  const openEdit = (question) => {
    setActiveQuestion(question);
    setFormData({
      subjectId: question.subject_id || "",
      topicId: question.topic_id || "",
      atomicTopicId: question.atomic_topic_id || "",
      text: question.text || "",
      optionA: question.options?.a || "",
      optionB: question.options?.b || "",
      optionC: question.options?.c || "",
      correctAnswer: question.correct_answer || "a",
      explanation: question.explanation || "",
      difficulty: question.difficulty || "medium",
      isDemo: Boolean(question.is_demo)
    });
    setIsEditOpen(true);
  };

  const openDelete = (question) => {
    setActiveQuestion(question);
    setIsDeleteOpen(true);
  };

  const handleAdd = async (event) => {
    event.preventDefault();
    await api.post("/api/admin/questions", {
      subjectId: Number(formData.subjectId),
      topicId: Number(formData.topicId),
      atomicTopicId: formData.atomicTopicId ? Number(formData.atomicTopicId) : null,
      text: formData.text,
      options: { a: formData.optionA, b: formData.optionB, c: formData.optionC },
      correctAnswer: formData.correctAnswer,
      explanation: formData.explanation,
      difficulty: formData.difficulty,
      isDemo: formData.isDemo
    });
    await loadData();
    setIsAddOpen(false);
  };

  const handleEdit = async (event) => {
    event.preventDefault();
    await api.put(`/api/admin/questions/${activeQuestion.id}`, {
      subjectId: Number(formData.subjectId),
      topicId: Number(formData.topicId),
      atomicTopicId: formData.atomicTopicId ? Number(formData.atomicTopicId) : null,
      text: formData.text,
      options: { a: formData.optionA, b: formData.optionB, c: formData.optionC },
      correctAnswer: formData.correctAnswer,
      explanation: formData.explanation,
      difficulty: formData.difficulty,
      isDemo: formData.isDemo
    });
    await loadData();
    setIsEditOpen(false);
  };

  const handleDelete = async () => {
    await api.delete(`/api/admin/questions/${activeQuestion.id}`);
    await loadData();
    setIsDeleteOpen(false);
  };

  const filteredTopics = topics.filter(
    (topic) => !formData.subjectId || Number(topic.subject_id) === Number(formData.subjectId)
  );
  const filteredAtomicTopics = atomicTopics.filter(
    (topic) => !formData.topicId || Number(topic.topic_id) === Number(formData.topicId)
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Manage Questions</h2>
          <p className="text-sm text-slate-600">Review questions, answers, and difficulty ratings.</p>
        </div>
        <button
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
          onClick={openAdd}
        >
          Add New
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <input
            type="text"
            placeholder="Search questions"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm sm:w-72"
          />
        </div>

        <div className="mt-4 space-y-4">
          {paginated.map((question) => (
            <div key={question.id} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{question.text}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Subject {question.subject_id} • Topic {question.topic_id} • Difficulty {question.difficulty}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
                    onClick={() => openEdit(question)}
                  >
                    Edit
                  </button>
                  <button
                    className="rounded-md border border-red-200 px-3 py-1 text-xs font-semibold text-red-600"
                    onClick={() => openDelete(question)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
                <div>
                  <span className="font-semibold text-slate-800">Options:</span> A) {question.options?.a} • B)
                  {question.options?.b} • C) {question.options?.c}
                </div>
                <div>
                  <span className="font-semibold text-slate-800">Answer:</span> {question.correct_answer}
                </div>
                <div className="sm:col-span-2">
                  <span className="font-semibold text-slate-800">Explanation:</span> {question.explanation || "-"}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <Modal open={isAddOpen} title="Add Question" onClose={() => setIsAddOpen(false)}>
        <form className="space-y-4" onSubmit={handleAdd}>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="text-sm text-slate-600">
              Subject
              <select
                name="subjectId"
                required
                value={formData.subjectId}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
              >
                <option value="">Select subject</option>
                {subjects.map((subject) => (
                  <option key={subject.subject_id} value={subject.subject_id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-slate-600">
              Topic
              <select
                name="topicId"
                required
                value={formData.topicId}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
              >
                <option value="">Select topic</option>
                {filteredTopics.map((topic) => (
                  <option key={topic.topic_id} value={topic.topic_id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-slate-600">
              Atomic Topic
              <select
                name="atomicTopicId"
                value={formData.atomicTopicId}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
              >
                <option value="">Optional</option>
                {filteredAtomicTopics.map((topic) => (
                  <option key={topic.atomic_topic_id} value={topic.atomic_topic_id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="text-sm text-slate-600">
            Question text
            <textarea
              name="text"
              required
              value={formData.text}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="text-sm text-slate-600">
              Option A
              <input
                name="optionA"
                required
                value={formData.optionA}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
              />
            </label>
            <label className="text-sm text-slate-600">
              Option B
              <input
                name="optionB"
                required
                value={formData.optionB}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
              />
            </label>
            <label className="text-sm text-slate-600">
              Option C
              <input
                name="optionC"
                required
                value={formData.optionC}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="text-sm text-slate-600">
              Correct answer
              <select
                name="correctAnswer"
                value={formData.correctAnswer}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
              >
                <option value="a">A</option>
                <option value="b">B</option>
                <option value="c">C</option>
              </select>
            </label>
            <label className="text-sm text-slate-600">
              Difficulty
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input name="isDemo" type="checkbox" checked={formData.isDemo} onChange={handleChange} />
              Demo question
            </label>
          </div>

          <label className="text-sm text-slate-600">
            Explanation
            <textarea
              name="explanation"
              value={formData.explanation}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
            />
          </label>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="rounded-md border border-slate-200 px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
              Save
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={isEditOpen} title="Edit Question" onClose={() => setIsEditOpen(false)}>
        <form className="space-y-4" onSubmit={handleEdit}>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="text-sm text-slate-600">
              Subject
              <select
                name="subjectId"
                required
                value={formData.subjectId}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
              >
                <option value="">Select subject</option>
                {subjects.map((subject) => (
                  <option key={subject.subject_id} value={subject.subject_id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-slate-600">
              Topic
              <select
                name="topicId"
                required
                value={formData.topicId}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
              >
                <option value="">Select topic</option>
                {filteredTopics.map((topic) => (
                  <option key={topic.topic_id} value={topic.topic_id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-slate-600">
              Atomic Topic
              <select
                name="atomicTopicId"
                value={formData.atomicTopicId}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
              >
                <option value="">Optional</option>
                {filteredAtomicTopics.map((topic) => (
                  <option key={topic.atomic_topic_id} value={topic.atomic_topic_id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="text-sm text-slate-600">
            Question text
            <textarea
              name="text"
              required
              value={formData.text}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="text-sm text-slate-600">
              Option A
              <input
                name="optionA"
                required
                value={formData.optionA}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
              />
            </label>
            <label className="text-sm text-slate-600">
              Option B
              <input
                name="optionB"
                required
                value={formData.optionB}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
              />
            </label>
            <label className="text-sm text-slate-600">
              Option C
              <input
                name="optionC"
                required
                value={formData.optionC}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="text-sm text-slate-600">
              Correct answer
              <select
                name="correctAnswer"
                value={formData.correctAnswer}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
              >
                <option value="a">A</option>
                <option value="b">B</option>
                <option value="c">C</option>
              </select>
            </label>
            <label className="text-sm text-slate-600">
              Difficulty
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input name="isDemo" type="checkbox" checked={formData.isDemo} onChange={handleChange} />
              Demo question
            </label>
          </div>

          <label className="text-sm text-slate-600">
            Explanation
            <textarea
              name="explanation"
              value={formData.explanation}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
            />
          </label>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="rounded-md border border-slate-200 px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
              Update
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={isDeleteOpen} title="Delete Question" onClose={() => setIsDeleteOpen(false)}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Are you sure you want to delete this question?</p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsDeleteOpen(false)}
              className="rounded-md border border-slate-200 px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default AdminQuestions;
