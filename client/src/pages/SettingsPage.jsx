const SettingsPage = () => (
  <section className="mx-auto max-w-4xl px-6 py-12">
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Account settings</h2>
      <p className="mt-2 text-sm text-slate-600">
        Manage your profile, subscriptions, and preferences.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">Full name</label>
          <input className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" defaultValue="Ananya Kapoor" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Email address</label>
          <input className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" defaultValue="ananya@example.com" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Preferred language</label>
          <select className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
            <option>English</option>
            <option>Hindi</option>
            <option>Marathi</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Theme</label>
          <select className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
            <option>Light</option>
            <option>Dark</option>
          </select>
        </div>
      </div>

      <div className="mt-8 border-t border-slate-200 pt-6">
        <h3 className="text-lg font-semibold text-slate-900">Subscription management</h3>
        <div className="mt-4 rounded-2xl border border-slate-200 p-4 text-sm text-slate-600">
          <p className="font-semibold text-slate-800">NISM Series V-A</p>
          <p>Expires on 16 Nov 2024</p>
          <button className="mt-3 rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
            Upgrade plan
          </button>
        </div>
      </div>
    </div>
  </section>
);

export default SettingsPage;
