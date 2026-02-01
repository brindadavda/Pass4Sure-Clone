import { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive ? "bg-blue-600 text-white" : "text-slate-700 hover:text-blue-600"
    }`;

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
    setIsLogoutConfirmOpen(false);
  };

  const initials = useMemo(() => {
    if (!user?.name) return "U";
    const parts = user.name.trim().split(/\s+/);
    const first = parts[0]?.[0] || "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return `${first}${last}`.toUpperCase();
  }, [user?.name]);

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-semibold text-white">
            P4S
          </div>
          <div>
            <p className="text-lg font-semibold">Pass4Sure</p>
            <p className="text-xs text-slate-500">Certification practice suite</p>
          </div>
        </div>
        <nav className="hidden items-center gap-2 md:flex">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/exams" className={linkClass}>
            Exams
          </NavLink>
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/practice" className={linkClass}>
            Practice
          </NavLink>
          {user?.role === "admin" && (
            <NavLink to="/admin" className={linkClass}>
              Admin
            </NavLink>
          )}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((open) => !open)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700"
                aria-haspopup="menu"
                aria-expanded={isUserMenuOpen}
              >
                {initials}
              </button>
              {isUserMenuOpen ? (
                <div className="absolute right-0 mt-2 w-40 rounded-md border border-slate-200 bg-white py-2 shadow-md">
                  <button
                    type="button"
                    onClick={() => setIsLogoutConfirmOpen(true)}
                    className="w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50"
                  >
                    Log out
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <NavLink
                to="/login"
                className="text-sm font-medium text-slate-600 hover:text-blue-600"
              >
                Log in
              </NavLink>
              <NavLink
                to="/signup"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Sign up
              </NavLink>
            </>
          )}
          <button
            type="button"
            className="flex items-center justify-center rounded-md border border-slate-200 p-2 text-slate-600 md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-4">
            <NavLink to="/" className={linkClass} onClick={() => setIsMenuOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/exams" className={linkClass} onClick={() => setIsMenuOpen(false)}>
              Exams
            </NavLink>
            <NavLink
              to="/dashboard"
              className={linkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/practice"
              className={linkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Practice
            </NavLink>
            {user?.role === "admin" && (
              <NavLink to="/admin" className={linkClass} onClick={() => setIsMenuOpen(false)}>
                Admin
              </NavLink>
            )}
            {user ? (
              <div className="mt-2 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                  {initials}
                </div>
                <button
                  type="button"
                  onClick={() => setIsLogoutConfirmOpen(true)}
                  className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="mt-2 flex flex-col gap-2">
                <NavLink
                  to="/login"
                  className="text-sm font-medium text-slate-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </NavLink>
                <NavLink
                  to="/signup"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign up
                </NavLink>
              </div>
            )}
          </nav>
        </div>
      )}
      {isLogoutConfirmOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-900">Log out?</h3>
            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to log out?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsLogoutConfirmOpen(false)}
                className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default NavBar;
