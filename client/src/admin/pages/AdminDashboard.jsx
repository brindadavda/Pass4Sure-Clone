const stats = [
  { label: "Total Subjects", value: "24" },
  { label: "Active Topics", value: "148" },
  { label: "Question Bank", value: "4,820" },
  { label: "Active Users", value: "1,240" }
];

const quickActions = [
  "Add new subject",
  "Review questions",
  "Check demo codes",
  "Audit user roles"
];

const AdminDashboard = () => (
  <div className="space-y-6">
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">{stat.label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{stat.value}</p>
        </div>
      ))}
    </section>

    <section className="grid gap-6 lg:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
        <h2 className="text-lg font-semibold text-slate-900">Admin overview</h2>
        <p className="mt-2 text-sm text-slate-600">
          Track everything happening across Pass4Sure. Keep subjects, topics, and questions up to
          date, and monitor user activity across the platform.
        </p>
        <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            Latest updates synced across subjects & topics.
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            Practice flow health: 99.2% uptime.
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Quick actions</h3>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          {quickActions.map((action) => (
            <li key={action} className="rounded-lg border border-slate-100 px-3 py-2">
              {action}
            </li>
          ))}
        </ul>
      </div>
    </section>
  </div>
);

export default AdminDashboard;
