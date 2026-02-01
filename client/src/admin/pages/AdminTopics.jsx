import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api.js";
import Modal from "../components/Modal.jsx";
import Pagination from "../components/Pagination.jsx";
import { calculateTotalPages, paginateItems } from "../utils.js";

const pageSize = 8;

const defaultForm = { topicId: "", subjectId: "", name: "", description: "" };

const AdminTopics = () => {
  const [topics, setTopics] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [activeTopic, setActiveTopic] = useState(null);

  const loadData = async () => {
    const [topicsRes, subjectsRes] = await Promise.all([
      api.get("/api/admin/topics"),
      api.get("/api/admin/subjects")
    ]);
    setTopics(topicsRes.data.topics || []);
    setSubjects(subjectsRes.data.subjects || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return topics.filter((topic) =>
      [topic.name, topic.description, String(topic.topic_id), String(topic.subject_id)].some((value) =>
        String(value || "").toLowerCase().includes(term)
      )
    );
  }, [topics, search]);

  const totalPages = calculateTotalPages(filtered, pageSize);
  const paginated = paginateItems(filtered, page, pageSize);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAdd = () => {
    setFormData(defaultForm);
    setIsAddOpen(true);
  };

  const openEdit = (topic) => {
    setActiveTopic(topic);
    setFormData({
      topicId: topic.topic_id,
      subjectId: topic.subject_id,
      name: topic.name || "",
      description: topic.description || ""
    });
    setIsEditOpen(true);
  };

  const openDelete = (topic) => {
    setActiveTopic(topic);
    setIsDeleteOpen(true);
  };

  const handleAdd = async (event) => {
    event.preventDefault();
    await api.post("/api/admin/topics", {
      topicId: Number(formData.topicId),
      subjectId: Number(formData.subjectId),
      name: formData.name,
      description: formData.description
    });
    await loadData();
    setIsAddOpen(false);
  };

  const handleEdit = async (event) => {
    event.preventDefault();
    await api.put(`/api/admin/topics/${activeTopic.topic_id}`, {
      subjectId: Number(formData.subjectId),
      name: formData.name,
      description: formData.description
    });
    await loadData();
    setIsEditOpen(false);
  };

  const handleDelete = async () => {
    await api.delete(`/api/admin/topics/${activeTopic.topic_id}`);
    await loadData();
    setIsDeleteOpen(false);
  };

  const subjectOptions = subjects.map((subject) => (
    <option key={subject.subject_id} value={subject.subject_id}>
      {subject.name}
    </option>
  ));

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Manage Topics</h2>
          <p className="text-sm text-slate-600">Align topics under their correct subjects.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/bulk-upload"
            className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:border-slate-300"
          >
            Bulk Upload
          </Link>
          <button
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
            onClick={openAdd}
          >
            Add New
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <input
            type="text"
            placeholder="Search topics"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm sm:w-72"
          />
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">Topic ID</th>
                <th className="px-3 py-2">Subject ID</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Description</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((topic, index) => (
                <tr key={topic.topic_id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50/40"}>
                  <td className="px-3 py-2 font-semibold text-slate-700">{topic.topic_id}</td>
                  <td className="px-3 py-2 text-slate-700">{topic.subject_id}</td>
                  <td className="px-3 py-2 text-slate-700">{topic.name}</td>
                  <td className="px-3 py-2 text-slate-500">{topic.description || "-"}</td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
                        onClick={() => openEdit(topic)}
                      >
                        Edit
                      </button>
                      <button
                        className="rounded-md border border-red-200 px-3 py-1 text-xs font-semibold text-red-600"
                        onClick={() => openDelete(topic)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <Modal open={isAddOpen} title="Add Topic" onClose={() => setIsAddOpen(false)}>
        <form className="space-y-4" onSubmit={handleAdd}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-slate-600">
              Topic ID
              <input
                name="topicId"
                type="number"
                required
                value={formData.topicId}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
              />
            </label>
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
                {subjectOptions}
              </select>
            </label>
          </div>
          <label className="text-sm text-slate-600">
            Name
            <input
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
            />
          </label>
          <label className="text-sm text-slate-600">
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
              rows={3}
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

      <Modal open={isEditOpen} title="Edit Topic" onClose={() => setIsEditOpen(false)}>
        <form className="space-y-4" onSubmit={handleEdit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-slate-600">
              Topic ID
              <input
                name="topicId"
                type="number"
                value={formData.topicId}
                disabled
                className="mt-1 w-full rounded-md border border-slate-200 bg-slate-100 px-3 py-2"
              />
            </label>
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
                {subjectOptions}
              </select>
            </label>
          </div>
          <label className="text-sm text-slate-600">
            Name
            <input
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
            />
          </label>
          <label className="text-sm text-slate-600">
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
              rows={3}
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

      <Modal open={isDeleteOpen} title="Delete Topic" onClose={() => setIsDeleteOpen(false)}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete <strong>{activeTopic?.name}</strong>?
          </p>
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

export default AdminTopics;
