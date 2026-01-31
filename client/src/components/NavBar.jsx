import { useState } from "react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive ? "bg-blue-600 text-white" : "text-slate-700 hover:text-blue-600"
    }`;

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-semibold">
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
          <NavLink to="/admin" className={linkClass}>
            Admin
          </NavLink>
        </nav>
        <div className="flex items-center gap-3">
          <NavLink
            to="/login"
            className="text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            Log in
          </NavLink>
          <NavLink
            to="/register"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Sign up
          </NavLink>
        </div>
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
            <NavLink to="/admin" className={linkClass} onClick={() => setIsMenuOpen(false)}>
              Admin
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavBar;
