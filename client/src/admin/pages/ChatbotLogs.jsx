import { useEffect, useMemo, useState } from "react";
import api from "../../lib/api.js";

const getUserLabel = (entry) => {
  if (!entry.user_id) return "Guest";
  if (entry.user_name) return entry.user_name;
  return entry.user_role
    ? `${entry.user_role.charAt(0).toUpperCase()}${entry.user_role.slice(1)}`
    : "User";
};

const ChatbotLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const rows = useMemo(() => logs, [logs]);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/api/chatbot/logs");
        setLogs(response.data.logs || []);
      } catch (fetchError) {
        console.error("Failed to load chatbot logs", fetchError);
        setError("Unable to load chatbot logs right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Chatbot logs</h2>
            <p className="text-sm text-slate-600">
              Review assistant conversations from guests and members.
            </p>
          </div>
        </div>

        {loading && (
          <p className="mt-6 text-sm text-slate-500">Loading chatbot logs...</p>
        )}

        {error && (
          <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3 text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="px-4">User</th>
                  <th className="px-4">User ID</th>
                  <th className="px-4">Message</th>
                  <th className="px-4">Reply</th>
                  <th className="px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                      No chatbot conversations yet.
                    </td>
                  </tr>
                )}
                {rows.map((entry) => (
                  <tr key={entry.id} className="rounded-2xl bg-slate-50 text-slate-700">
                    <td className="px-4 py-4 font-semibold">
                      {getUserLabel(entry)}
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500">
                      {entry.user_id || "--"}
                    </td>
                    <td className="px-4 py-4">{entry.message}</td>
                    <td className="px-4 py-4">{entry.reply}</td>
                    <td className="px-4 py-4 text-xs text-slate-500">
                      {new Date(entry.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default ChatbotLogs;
