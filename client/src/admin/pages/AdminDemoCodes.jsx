import { useEffect, useMemo, useState } from "react";
import api from "../../lib/api.js";
import Modal from "../components/Modal.jsx";
import Pagination from "../components/Pagination.jsx";
import { calculateTotalPages, paginateItems } from "../utils.js";

const pageSize = 8;

const defaultForm = { topicId: "", demoCode: "" };

const AdminDemoCodes = () => {
  const [demoCodes, setDemoCodes] = useState([]);
  const [topics, setTopics] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [activeDemo, setActiveDemo] = useState(null);

  const loadData = async () => {
    const [demoRes, topicsRes] = await Promise.all([
      api.get("/api/admin/demo-codes"),
      api.get("/api/admin/topics")
    ]);
    setDemoCodes(demoRes.data.demoCodes || []);
    setTopics(topicsRes.data.topics || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return demoCodes.filter((demo) =>
      [String(demo.topic_id), demo.demo_code].some((value) =>
        String(value || "").toLowerCase().includes(term)
      )
    );
  }, [demoCodes, search]);

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

  const openEdit = (demo) => {
    setActiveDemo(demo);
    setFormData({ topicId: demo.topic_id, demoCode: demo.demo_code || "" });
    setIsEditOpen(true);
  };

  const openDelete = (demo) => {
    setActiveDemo(demo);
    setIsDeleteOpen(true);
  };

  const handleAdd = async (event) => {
    event.preventDefault();
    await api.post("/api/admin/demo-codes", {
      topicId: Number(formData.topicId),
      demoCode: formData.demoCode
    });
    await loadData();
    setIsAddOpen(false);
  };

  const handleEdit = async (event) => {
    event.preventDefault();
    await api.put(`/api/admin/demo-codes/${activeDemo.topic_id}`, {
      demoCode: formData.demoCode
    });
    await loadData();
    setIsEditOpen(false);
  };

  const handleDelete = async () => {
    await api.delete(`/api/admin/demo-codes/${activeDemo.topic_id}`);
    await loadData();
    setIsDeleteOpen(false);
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Manage Demo Codes</h2>
          <p className="text-sm text-slate-600">Control demo access per topic.</p>
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
            placeholder="Search demo codes"
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
                <th className="px-3 py-2">Demo Code</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((demo, index) => (
                <tr key={demo.topic_id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50/40"}>
                  <td className="px-3 py-2 font-semibold text-slate-700">{demo.topic_id}</td>
                  <td className="px-3 py-2 text-slate-500">{demo.demo_code}</td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
                        onClick={() => openEdit(demo)}
                      >
                        Edit
                      </button>
                      <button
                        className="rounded-md border border-red-200 px-3 py-1 text-xs font-semibold text-red-600"
                        onClick={() => openDelete(demo)}
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

      <Modal open={isAddOpen} title="Add Demo Code" onClose={() => setIsAddOpen(false)}>
        <form className="space-y-4" onSubmit={handleAdd}>
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
              {topics.map((topic) => (
                <option key={topic.topic_id} value={topic.topic_id}>
                  {topic.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-slate-600">
            Demo Code
            <input
              name="demoCode"
              required
              value={formData.demoCode}
              onChange={handleChange}
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

      <Modal open={isEditOpen} title="Edit Demo Code" onClose={() => setIsEditOpen(false)}>
        <form className="space-y-4" onSubmit={handleEdit}>
          <label className="text-sm text-slate-600">
            Topic ID
            <input
              name="topicId"
              value={formData.topicId}
              disabled
              className="mt-1 w-full rounded-md border border-slate-200 bg-slate-100 px-3 py-2"
            />
          </label>
          <label className="text-sm text-slate-600">
            Demo Code
            <input
              name="demoCode"
              required
              value={formData.demoCode}
              onChange={handleChange}
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

      <Modal open={isDeleteOpen} title="Delete Demo Code" onClose={() => setIsDeleteOpen(false)}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete demo code for topic {activeDemo?.topic_id}?
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

export default AdminDemoCodes;
