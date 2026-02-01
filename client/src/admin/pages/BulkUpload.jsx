import { useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import api from "../../lib/api.js";

const tableOptions = [
  { value: "exams", label: "Exams" },
  { value: "subjects", label: "Subjects" },
  { value: "topics", label: "Topics" },
  { value: "atomic_topics", label: "Atomic Topics" },
  { value: "questions", label: "Questions" },
  { value: "demo_codes", label: "Demo Codes" },
  { value: "users", label: "Users" }
];

const tableLinks = {
  subjects: "/admin/subjects",
  topics: "/admin/topics",
  atomic_topics: "/admin/topics",
  questions: "/admin/questions",
  demo_codes: "/admin/demo-codes",
  exams: "/admin/exams",
  users: "/admin/users"
};

const BulkUpload = () => {
  const location = useLocation();
  const initialTable = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const requested = params.get("table");
    const match = tableOptions.find((option) => option.value === requested);
    return match?.value || tableOptions[0].value;
  }, [location.search]);
  const [tableName] = useState(initialTable);
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [insertedCount, setInsertedCount] = useState(null);
  const [error, setError] = useState("");
  const [errorRow, setErrorRow] = useState(null);

  const tableLabel =
    tableOptions.find((option) => option.value === tableName)?.label ||
    tableName.replace(/_/g, " ");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError("Please select a CSV file to upload.");
      setInsertedCount(null);
      setErrorRow(null);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("tableName", tableName);

    setIsSubmitting(true);
    setError("");
    setInsertedCount(null);
    setErrorRow(null);

    try {
      const response = await api.post("/api/admin/upload-csv", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setInsertedCount(response.data.insertedCount || 0);
    } catch (uploadError) {
      console.error("Bulk upload failed", uploadError);
      const rowNumber = uploadError.response?.data?.rowNumber;
      setErrorRow(rowNumber || null);
      setError(uploadError.response?.data?.message || "Bulk upload failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-6 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Bulk Upload Records</h2>
            <p className="text-sm text-slate-600">
              Upload CSV files to insert or update {tableLabel} records.
            </p>
          </div>
          {tableLinks[tableName] && (
            <Link
              to={tableLinks[tableName]}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Back to {tableLabel}
            </Link>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-slate-700" htmlFor="csvFile">
              Upload CSV file
            </label>
            <input
              id="csvFile"
              type="file"
              accept=".csv"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 md:w-fit"
          >
            {isSubmitting ? "Uploading..." : "Upload CSV"}
          </button>
        </form>

        {insertedCount !== null && !error && (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Inserted: {insertedCount} rows successfully.
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
            {errorRow && <span className="ml-2 font-semibold">Row {errorRow}</span>}
          </div>
        )}

        <div className="mt-6 text-xs text-slate-500">
          Ensure your CSV headers match the table columns (for example, <code>subject_id</code>,
          <code>name</code>, <code>description</code> for subjects).
        </div>
      </div>
    </section>
  );
};

export default BulkUpload;
