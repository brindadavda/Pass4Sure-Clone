import { NavLink } from "react-router-dom";

const NavBar = () => {
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
            Get Started
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
