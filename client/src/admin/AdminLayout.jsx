import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const navItems = [
  { label: "Dashboard Overview", to: "/admin" },
  { label: "Manage Exams", to: "/admin/exams" },
  { label: "Manage Subjects", to: "/admin/subjects" },
  { label: "Manage Topics", to: "/admin/topics" },
  { label: "Manage Questions", to: "/admin/questions" },
  { label: "Manage Demo Codes", to: "/admin/demo-codes" },
  { label: "Manage Users", to: "/admin/users" },
  { label: "User Activity Logs", to: "/admin/activity" }
];

const AdminLayout = () => {
  const { user } = useAuth();
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : user?.email
      ? user.email.slice(0, 2).toUpperCase()
      : "AD";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 lg:px-6">
        <aside className="hidden w-64 flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex">
          <div className="mb-6 px-2">
            <p className="text-xs font-semibold uppercase text-slate-400">Admin Panel</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">Pass4Sure</h2>
          </div>
          <nav className="flex flex-1 flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/admin"}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-6 rounded-xl bg-slate-100 px-3 py-3 text-xs text-slate-600">
            Logged in as <span className="font-semibold">{user?.name || "Admin"}</span>
          </div>
        </aside>

        <div className="flex-1">
          <header className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">Admin Workspace</p>
              <h1 className="text-2xl font-semibold text-slate-900">Control Center</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                {user?.email}
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
                {initials}
              </div>
            </div>
          </header>

          <div className="lg:hidden">
            <div className="mb-4 grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/admin"}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-xs font-semibold ${
                      isActive ? "bg-blue-600 text-white" : "bg-white text-slate-600"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
