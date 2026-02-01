import { useEffect, useMemo, useState } from "react";
import api from "../../lib/api.js";
import Pagination from "../components/Pagination.jsx";
import { calculateTotalPages, paginateItems } from "../utils.js";

const pageSize = 10;

const formatUser = (activity) => {
  if (!activity.user_email) {
    return "Guest";
  }
  return `${activity.user_name || "User"} (${activity.user_email})`;
};

const AdminActivity = () => {
  const [activity, setActivity] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const loadActivity = async () => {
    const response = await api.get("/api/admin/activity");
    setActivity(response.data.activity || []);
  };

  useEffect(() => {
    loadActivity();
  }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return activity.filter((entry) =>
      [
        entry.activity_type,
        entry.page,
        entry.user_email,
        entry.user_name,
        JSON.stringify(entry.details || {})
      ].some((value) => String(value || "").toLowerCase().includes(term))
    );
  }, [activity, search]);

  const totalPages = calculateTotalPages(filtered, pageSize);
  const paginated = paginateItems(filtered, page, pageSize);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">User Activity Logs</h2>
        <p className="text-sm text-slate-600">Track the latest platform activity and audits.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <input
            type="text"
            placeholder="Search activity"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm sm:w-72"
          />
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">Timestamp</th>
                <th className="px-3 py-2">User</th>
                <th className="px-3 py-2">Activity</th>
                <th className="px-3 py-2">Page</th>
                <th className="px-3 py-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((entry, index) => (
                <tr key={entry.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50/40"}>
                  <td className="px-3 py-2 text-slate-600">
                    {new Date(entry.created_at).toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-slate-700">{formatUser(entry)}</td>
                  <td className="px-3 py-2 text-slate-700">{entry.activity_type}</td>
                  <td className="px-3 py-2 text-slate-500">{entry.page}</td>
                  <td className="px-3 py-2 text-xs text-slate-500">
                    {entry.details ? JSON.stringify(entry.details) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </section>
  );
};

export default AdminActivity;
