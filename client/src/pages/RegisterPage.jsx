import { Link } from "react-router-dom";

const RegisterPage = () => (
  <section className="mx-auto max-w-lg px-6 py-12">
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Create account</h2>
      <p className="mt-2 text-sm text-slate-600">Start with free demos and upgrade anytime.</p>
      <form className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700">Full name</label>
          <input className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input type="email" className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Password</label>
          <input type="password" className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <button className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
          Create account
        </button>
      </form>
      <div className="mt-4 text-sm text-slate-500">
        Already registered? <Link to="/login" className="text-blue-600">Log in</Link>
      </div>
    </div>
  </section>
);

export default RegisterPage;
