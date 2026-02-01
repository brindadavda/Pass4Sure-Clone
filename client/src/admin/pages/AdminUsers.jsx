import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api.js";
import Modal from "../components/Modal.jsx";
import Pagination from "../components/Pagination.jsx";
import { calculateTotalPages, paginateItems } from "../utils.js";

const pageSize = 8;

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeUser, setActiveUser] = useState(null);
  const [role, setRole] = useState("user");

  const loadUsers = async () => {
    const response = await api.get("/api/admin/users");
    setUsers(response.data.users || []);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return users.filter((user) =>
      [user.name, user.email, user.role].some((value) =>
        String(value || "").toLowerCase().includes(term)
      )
    );
  }, [users, search]);

  const totalPages = calculateTotalPages(filtered, pageSize);
  const paginated = paginateItems(filtered, page, pageSize);

  const openEdit = (user) => {
    setActiveUser(user);
    setRole(user.role || "user");
    setIsEditOpen(true);
  };

  const openDelete = (user) => {
    setActiveUser(user);
    setIsDeleteOpen(true);
  };

  const handleEdit = async (event) => {
    event.preventDefault();
    await api.put(`/api/admin/users/${activeUser.id}/role`, { role });
    await loadUsers();
    setIsEditOpen(false);
  };

  const handleDelete = async () => {
    await api.delete(`/api/admin/users/${activeUser.id}`);
    await loadUsers();
    setIsDeleteOpen(false);
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Manage Users</h2>
          <p className="text-sm text-slate-600">Update roles and manage access.</p>
        </div>
        <Link
          to="/admin/bulk-upload"
          className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:border-slate-300"
        >
          Bulk Upload
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <input
            type="text"
            placeholder="Search users"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm sm:w-72"
          />
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((user, index) => (
                <tr key={user.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50/40"}>
                  <td className="px-3 py-2 font-semibold text-slate-700">{user.name}</td>
                  <td className="px-3 py-2 text-slate-500">{user.email}</td>
                  <td className="px-3 py-2 text-slate-700">{user.role}</td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
                        onClick={() => openEdit(user)}
                      >
                        Edit Role
                      </button>
                      <button
                        className="rounded-md border border-red-200 px-3 py-1 text-xs font-semibold text-red-600"
                        onClick={() => openDelete(user)}
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

      <Modal open={isEditOpen} title="Update User Role" onClose={() => setIsEditOpen(false)}>
        <form className="space-y-4" onSubmit={handleEdit}>
          <div className="text-sm text-slate-600">
            <p className="font-semibold text-slate-900">{activeUser?.name}</p>
            <p>{activeUser?.email}</p>
          </div>
          <label className="text-sm text-slate-600">
            Role
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
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

      <Modal open={isDeleteOpen} title="Delete User" onClose={() => setIsDeleteOpen(false)}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete <strong>{activeUser?.email}</strong>?
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

export default AdminUsers;
