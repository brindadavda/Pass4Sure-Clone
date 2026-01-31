import { useEffect, useMemo, useState } from "react";
import api from "../../lib/api.js";
import Modal from "../components/Modal.jsx";
import Pagination from "../components/Pagination.jsx";
import { calculateTotalPages, paginateItems } from "../utils.js";

const pageSize = 8;

const defaultForm = {
  title: "",
  category: "",
  price: "",
  validityDays: "",
  description: ""
};

const AdminExams = () => {
  const [exams, setExams] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [activeExam, setActiveExam] = useState(null);

  const loadExams = async () => {
    const response = await api.get("/api/admin/exams");
    setExams(response.data.exams || []);
  };

  useEffect(() => {
    loadExams();
  }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return exams.filter((exam) =>
      [exam.title, exam.category, exam.description].some((value) =>
        String(value || "").toLowerCase().includes(term)
      )
    );
  }, [exams, search]);

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

  const openEdit = (exam) => {
    setActiveExam(exam);
    setFormData({
      title: exam.title || "",
      category: exam.category || "",
      price: exam.price ?? "",
      validityDays: exam.validity_days ?? "",
      description: exam.description || ""
    });
    setIsEditOpen(true);
  };

  const openDelete = (exam) => {
    setActiveExam(exam);
    setIsDeleteOpen(true);
  };

  const handleAdd = async (event) => {
    event.preventDefault();
    await api.post("/api/admin/exams", {
      title: formData.title,
      category: formData.category,
      price: Number(formData.price),
      validityDays: Number(formData.validityDays),
      description: formData.description
    });
    await loadExams();
    setIsAddOpen(false);
  };

  const handleEdit = async (event) => {
    event.preventDefault();
    await api.put(`/api/admin/exams/${activeExam.id}`, {
      title: formData.title,
      category: formData.category,
      price: Number(formData.price),
      validityDays: Number(formData.validityDays),
      description: formData.description
    });
    await loadExams();
    setIsEditOpen(false);
  };

  const handleDelete = async () => {
    await api.delete(`/api/admin/exams/${activeExam.id}`);
    await loadExams();
    setIsDeleteOpen(false);
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Manage Exams</h2>
          <p className="text-sm text-slate-600">Create and maintain the exam catalog.</p>
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
            placeholder="Search exams"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm sm:w-72"
          />
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Price</th>
                <th className="px-3 py-2">Validity (days)</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((exam, index) => (
                <tr key={exam.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50/40"}>
                  <td className="px-3 py-2 font-semibold text-slate-700">{exam.title}</td>
                  <td className="px-3 py-2 text-slate-600">{exam.category}</td>
                  <td className="px-3 py-2 text-slate-600">{exam.price}</td>
                  <td className="px-3 py-2 text-slate-600">{exam.validity_days}</td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
                        onClick={() => openEdit(exam)}
                      >
                        Edit
                      </button>
                      <button
                        className="rounded-md border border-red-200 px-3 py-1 text-xs font-semibold text-red-600"
                        onClick={() => openDelete(exam)}
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

      <Modal open={isAddOpen} title="Add Exam" onClose={() => setIsAddOpen(false)}>
        <form className="space-y-4" onSubmit={handleAdd}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-slate-600">
              Title
              <input
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
              />
            </label>
            <label className="text-sm text-slate-600">
              Category
              <input
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
              />
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-slate-600">
              Price
              <input
                name="price"
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
              />
            </label>
            <label className="text-sm text-slate-600">
              Validity (days)
              <input
                name="validityDays"
                type="number"
                required
                value={formData.validityDays}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
              />
            </label>
          </div>
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

      <Modal open={isEditOpen} title="Edit Exam" onClose={() => setIsEditOpen(false)}>
        <form className="space-y-4" onSubmit={handleEdit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-slate-600">
              Title
              <input
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
              />
            </label>
            <label className="text-sm text-slate-600">
              Category
              <input
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
              />
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-slate-600">
              Price
              <input
                name="price"
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
              />
            </label>
            <label className="text-sm text-slate-600">
              Validity (days)
              <input
                name="validityDays"
                type="number"
                required
                value={formData.validityDays}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
              />
            </label>
          </div>
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

      <Modal open={isDeleteOpen} title="Delete Exam" onClose={() => setIsDeleteOpen(false)}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete <strong>{activeExam?.title}</strong>?
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

export default AdminExams;
