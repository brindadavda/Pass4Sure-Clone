const StatCard = ({ label, value, meta }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <p className="text-sm font-medium text-slate-500">{label}</p>
    <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
    {meta ? <p className="mt-2 text-xs text-slate-400">{meta}</p> : null}
  </div>
);

export default StatCard;
