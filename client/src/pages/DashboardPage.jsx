import StatCard from "../components/StatCard.jsx";

const DashboardPage = () => (
  <section className="mx-auto max-w-6xl px-6 py-12">
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <div className="flex-1 space-y-6">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900">Welcome back, Ananya</h2>
          <p className="mt-2 text-sm text-slate-600">
            Track your performance and upcoming subscription expiries.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard label="Overall accuracy" value="82%" meta="+4% from last week" />
          <StatCard label="Mock tests completed" value="14" meta="2 scheduled this week" />
          <StatCard label="Average speed" value="38 sec" meta="Per question" />
          <StatCard label="Weak topics" value="5" meta="Derivatives, Taxation" />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Recent practice sessions</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>NISM Series V-A Mock Test</span>
              <span className="font-semibold text-green-600">82%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>NCFM Capital Markets Practice</span>
              <span className="font-semibold text-yellow-600">74%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>BSE Derivatives Revision</span>
              <span className="font-semibold text-red-500">63%</span>
            </div>
          </div>
        </div>
      </div>
      <aside className="w-full max-w-sm space-y-4">
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <h3 className="text-lg font-semibold text-blue-900">Subscription alerts</h3>
          <p className="mt-2 text-sm text-blue-800">
            NISM Series V-A expires in 12 days. Renew now to keep access.
          </p>
          <button className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
            Renew plan
          </button>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">AI study plan</h3>
          <p className="mt-2 text-sm text-slate-600">
            Get a personalized weekly plan based on your accuracy trends.
          </p>
          <button className="mt-4 rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
            Generate plan
          </button>
        </div>
      </aside>
    </div>
  </section>
);

export default DashboardPage;
