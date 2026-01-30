const AdminPage = () => (
  <section className="mx-auto max-w-6xl px-6 py-12">
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Admin control center</h2>
          <p className="text-sm text-slate-600">
            Manage exams, questions, pricing, and subscriptions from one place.
          </p>
        </div>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
          Add new exam
        </button>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-5">
          <h3 className="text-lg font-semibold text-slate-900">Exam catalog</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li className="flex items-center justify-between">
              <span>NISM Series V-A</span>
              <span className="text-xs font-semibold text-blue-600">Active</span>
            </li>
            <li className="flex items-center justify-between">
              <span>NCFM Capital Markets</span>
              <span className="text-xs font-semibold text-blue-600">Active</span>
            </li>
            <li className="flex items-center justify-between">
              <span>BSE Derivatives</span>
              <span className="text-xs font-semibold text-slate-400">Draft</span>
            </li>
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 p-5">
          <h3 className="text-lg font-semibold text-slate-900">Question library</h3>
          <p className="mt-2 text-sm text-slate-600">
            2,400 questions across 6 categories with 95% coverage.
          </p>
          <div className="mt-4 grid gap-3 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Pending approvals</span>
              <span className="font-semibold text-slate-900">34</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Updated this week</span>
              <span className="font-semibold text-slate-900">18</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5 text-sm text-blue-900">
        <p className="font-semibold">Analytics snapshot</p>
        <p className="mt-2">
          1,240 active learners • ₹3.2L monthly revenue • 92% renewal rate
        </p>
      </div>
    </div>
  </section>
);

export default AdminPage;
